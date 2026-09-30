# Site Cars Factory 21

Site de Cars Factory 21, carrosserie et mécanique à Chevigny-Saint-Sauveur (Côte-d’Or).
Même base technique que ete-85.fr : React + Vite + Tailwind, pages pré-rendues pour Google, formulaire PHP pour OVH.

## Commandes

```
npm run dev        # aperçu pendant le travail : http://localhost:5173
npm test           # tests automatiques (titres Google, liens)
npm run build      # construit le site dans dist/ (pages HTML complètes + plan du site)
npm run preview    # sert dist/ comme OVH : http://localhost:5181
npm run test:site  # tests dans un vrai navigateur (ordinateur + téléphone), après npm run build
```

## À compléter avant la mise en ligne

- `src/config.ts` : e-mail, lien des avis Google, capital et RCS, hébergeur ; confirmer « Devis gratuit » et « Prix annoncé avant travaux ».
- `src/pages/Accueil.tsx` : présentation du garage, 3 vrais avis clients (avec leur accord).
- `src/pages/services.ts` : réponses marquées « [À confirmer avec le garage] ».
- `public/api/devis.php` : adresse e-mail du garage et adresse d’envoi du site.
- Nom de domaine : `siteUrl` (config.ts), `SITE` (scripts/prerendu.mjs), `index.html`, `public/.htaccess`, `public/robots.txt`.
- Remplacer peu à peu les photos d’illustration par de vraies photos de l’atelier.

## Photos

Photos d’illustration non contractuelles, Unsplash (licence gratuite, usage commercial autorisé), en 960, 1920 et 3840 px (4K).
Auteurs dans `src/photos.json`, affichés dans les mentions légales. Pour en changer : `node scripts/telecharger-photos.mjs`.
