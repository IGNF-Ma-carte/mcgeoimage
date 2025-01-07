export default {
  // HELP
  helmert: `# Transformation
-------
A partir des points homologues entre l'image et la carte, le géoréférencement calcul une transformation qui minimise les écarts entre les positions des points connues.
La transformation peut s'analyser comme la combinaison d'une translation, rotation et mise à l'échelle pour rendre superposable l'image à la carte.

2 types de transformation sont disponible : 
* une transformation de **Helmert** qui utilise une mise à l'échelle différente sur les axes de la carte. Elle est utilisée en topographie pour intégrer dans un plan en coordonnées générales ou un lever de qualité suffisante mais en coordonnées locales.
* une simple **similitude** qui évite les déformations (cisaillements) pouvant apparaître lors de l'utilisation d'une Helmert.
`,
ptAppuie: `# Les points d'appuie
-------
Les points d'appuie sont des points homologue entre l'image et la carte sur lesquels va se calculer la transformation.
Vous pouvez enregistrer ses points dans un fichier et les appliquer sur une autre carte sur la même zone ou pour reprendre le géoréférencement de la carte si vous avez été intérrompu ou si vous vouler pouvoir l'améliorer par la suite.
`,
helpImage: `# Images
-------
Si vous avez déjà géoréférencé des images, vous pouvez les enregistrer dans un fichier carte et les recharger en les glissant dans la zone dédiée.
Vous pouvez ensuite les afficher en référence pour vous aider à référencer la nouvelle image. Ces couches sont accessibles dans le gestionnaire de couche pour en modifier l'ordre ou la visibilité.
`,
  // SAVE
  saveTitle: "Enregistrer",
  save: "Enregistrer",
  saveAs: "Enregistre sous",
  cancel: "annuler"
}