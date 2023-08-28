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
  // SAVE
  saveTitle: "Enregistrer",
  save: "Enregistrer",
  saveAs: "Enregistre sous",
  cancel: "annuler"
}