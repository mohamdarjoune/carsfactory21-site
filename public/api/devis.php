<?php
/**
 * Cars Factory 21 – Demande de devis : envoyée par e-mail au garage par l'hébergement, photos en pièces jointes.
 * Rien n'est conservé sur le site (voir la page Confidentialité).
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

/* ───────── Réglages (à compléter avant la mise en ligne) ───────── */
const DESTINATAIRE     = '[E-mail du garage]';
const EXPEDITEUR       = '[Adresse d’envoi du site, ex. site@cars-factory-21.fr]';
const SITES_AUTORISES  = ['https://www.cars-factory-21.fr', 'https://cars-factory-21.fr', 'http://localhost:5173'];
const MAX_PAR_JOUR     = 40;                // protection contre les envois massifs
const PHOTOS_MAX       = 3;
const TAILLE_PHOTO_MAX = 4 * 1024 * 1024;   // 4 Mo (les photos sont réduites dans le navigateur avant l'envoi)

function repondre(int $code, array $donnees): void
{
    http_response_code($code);
    echo json_encode($donnees, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Texte d'un champ : sans caractères de contrôle, longueur limitée ($multiligne : garde les retours à la ligne). */
function champ(string $nom, int $max, bool $multiligne = false): string
{
    $v = $_POST[$nom] ?? '';
    if (!is_string($v)) {
        return '';
    }
    $v = str_replace("\r\n", "\n", $v);
    $v = (string) preg_replace($multiligne ? '/[^\P{C}\n]/u' : '/\p{C}/u', ' ', $v);
    return trim(mb_substr($v, 0, $max));
}

/* ───────── 1. Contrôles ───────── */
if (str_starts_with(DESTINATAIRE, '[')) {
    repondre(503, ['erreur' => 'Formulaire pas encore configuré']);
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    repondre(405, ['erreur' => 'Méthode non autorisée']);
}
if (!in_array($_SERVER['HTTP_ORIGIN'] ?? '', SITES_AUTORISES, true)) {
    repondre(403, ['erreur' => 'Origine non autorisée']);
}
if (champ('site_web', 200) !== '') {
    repondre(200, ['ok' => true]);   // piège à robots
}

$d = [
    'nom'        => champ('nom', 100),
    'telephone'  => champ('telephone', 30),
    'email'      => champ('email', 150),
    'vehicule'   => champ('vehicule', 120),
    'prestation' => champ('prestation', 60) ?: 'Non précisée',
    'message'    => champ('message', 5000, true),
];
if ($d['nom'] === '' || $d['telephone'] === '' || $d['vehicule'] === '' || $d['message'] === '') {
    repondre(400, ['erreur' => 'Nom, téléphone, véhicule et message sont obligatoires']);
}
if ($d['email'] !== '' && !filter_var($d['email'], FILTER_VALIDATE_EMAIL)) {
    $d['email'] = '';
}
if (($_POST['consentement'] ?? '') === '') {
    repondre(400, ['erreur' => 'Le consentement est obligatoire']);
}

/* ───────── 2. Limite quotidienne (hors du dossier public) ───────── */
$dossier = dirname(__DIR__, 2) . '/cf21-data';
if (!is_dir($dossier)) {
    @mkdir($dossier, 0700, true);
}
$compteur = $dossier . '/devis-' . date('Y-m-d') . '.txt';
$f = @fopen($compteur, 'c+');
if ($f !== false) {
    flock($f, LOCK_EX);
    $n = (int) stream_get_contents($f);
    if ($n >= MAX_PAR_JOUR) {
        flock($f, LOCK_UN);
        fclose($f);
        repondre(429, ['erreur' => 'Trop de demandes aujourd’hui']);
    }
    ftruncate($f, 0);
    rewind($f);
    fwrite($f, (string) ($n + 1));
    flock($f, LOCK_UN);
    fclose($f);
    foreach (glob($dossier . '/devis-*.txt') ?: [] as $ancien) {
        if ($ancien !== $compteur) {
            @unlink($ancien);
        }
    }
}

/* ───────── 3. Photos (JPEG, PNG ou WebP uniquement, vérifiées par leur contenu) ───────── */
$photos = [];
$envoyees = $_FILES['photos'] ?? null;
if (is_array($envoyees) && is_array($envoyees['tmp_name'] ?? null)) {
    foreach ($envoyees['tmp_name'] as $i => $tmp) {
        if (count($photos) >= PHOTOS_MAX || ($envoyees['error'][$i] ?? 1) !== UPLOAD_ERR_OK || !is_uploaded_file($tmp)) {
            continue;
        }
        if (($envoyees['size'][$i] ?? 0) > TAILLE_PHOTO_MAX) {
            continue;
        }
        $type = (string) (new finfo(FILEINFO_MIME_TYPE))->file($tmp);
        $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$type] ?? null;
        if ($ext !== null) {
            $photos[] = ['nom' => 'photo-' . (count($photos) + 1) . '.' . $ext, 'type' => $type, 'contenu' => (string) file_get_contents($tmp)];
        }
    }
}

/* ───────── 4. E-mail au garage ───────── */
$texte = implode("\r\n", [
    'Nouvelle demande de devis depuis le site',
    '',
    'Nom        : ' . $d['nom'],
    'Téléphone  : ' . $d['telephone'],
    'E-mail     : ' . ($d['email'] ?: '—'),
    'Véhicule   : ' . $d['vehicule'],
    'Prestation : ' . $d['prestation'],
    'Photos     : ' . count($photos),
    'Date       : ' . date('d/m/Y H:i'),
    '',
    'Demande :',
    str_replace("\n", "\r\n", $d['message']),
]);
$frontiere = 'cf21-' . bin2hex(random_bytes(8));
$corps = "--$frontiere\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n$texte\r\n";
foreach ($photos as $p) {
    $corps .= "--$frontiere\r\nContent-Type: {$p['type']}; name=\"{$p['nom']}\"\r\nContent-Transfer-Encoding: base64\r\n"
            . "Content-Disposition: attachment; filename=\"{$p['nom']}\"\r\n\r\n" . chunk_split(base64_encode($p['contenu'])) . "\r\n";
}
$corps .= "--$frontiere--";

$entetes = [
    'From'         => 'Site Cars Factory 21 <' . EXPEDITEUR . '>',
    'MIME-Version' => '1.0',
    'Content-Type' => 'multipart/mixed; boundary="' . $frontiere . '"',
];
if ($d['email'] !== '') {
    $entetes['Reply-To'] = $d['email'];   // validé par filter_var : aucun retour à la ligne possible
}
$objet = 'Devis – ' . $d['prestation'] . ' – ' . $d['nom'] . ' (' . $d['vehicule'] . ')';
$ok = @mail(DESTINATAIRE, mb_encode_mimeheader($objet, 'UTF-8', 'B'), $corps, $entetes, '-f' . EXPEDITEUR);

$ok ? repondre(200, ['ok' => true]) : repondre(500, ['erreur' => 'Envoi impossible']);
