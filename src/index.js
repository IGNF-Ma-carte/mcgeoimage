import FileSaver from 'file-saver'
import charte from 'mcutils/charte/macarte'
import './i18n'
import './georef/georef.js'
import './unload'
import './page/loadFile.js'
import carte from './map/carte'
import imageMap from './map/imageMap'
import GeoImage from 'mcutils/format/layer/GeoImage'

import './tabs/tabs'

charte.setApp('geoimage', 'Ma carte');

// Add tool button
charte.addTool('download', 'fi-download ', 'Enregistrer dans un fichier...', () => {
  const data = carte.write();
  // Save in a file
  var blob = new Blob([JSON.stringify(data, null, ' ')], { type: 'text/plain;charset=utf-8' });
  FileSaver.saveAs(blob, 'carte.carte');
})
/*
charte.addTool('save', 'fi-save', 'Enregistrer', () => {})
charte.addTool('open', 'fi-open', 'Ouvrir', () => {})
charte.addTool('')
charte.addTool('new', 'fi-new', 'Créer une nouvelle carte', () => {})
*/

/* DEBUG */
window.charte = charte;
window.carte = carte;
window.imageMap = imageMap;
/**/