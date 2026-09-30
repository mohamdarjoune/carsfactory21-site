# Vidéo de présentation (dessin animé)

`garage.html` contient tout le film (48 s, 9 scènes) : décors, voiture, textes et minutage.
Ouvrir `garage.html#lecture` dans un navigateur pour le voir tourner en boucle.

Pour refaire le fichier MP4 (1920×1080, 30 images/s) après une modification :

```
cd outils/video
npm install --no-save ffmpeg-static
node exporter.mjs ../../medias/presentation-cars-factory-21.mp4
```

`node apercu.mjs 3,13,35` crée une planche d'images-clés (`planche.jpg`) pour vérifier sans tout exporter.
Le fichier MP4 n'est pas enregistré dans l'historique du site (trop lourd).
