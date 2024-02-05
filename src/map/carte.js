import charte, { connectDialog } from 'mcutils/charte/macarte'
import Carte from 'mcutils/Carte'
import dlgload from 'mcutils/dialog/dialogMessage';
import config from 'mcutils/config/config'

import addControlPoints from '../georef/controlPoints.js'
import LayerImage from 'ol/layer/Image'

import '../page/carte.css'

// Carte
const carte = new Carte({
  key: config.gppKey,
  target: charte.getAppElement()
});
carte.setSelectStyle({ type:'default' });
carte.geoimage = new LayerImage({ 
  title: 'geoImage' 
})
carte.geoimage.set('type', 'GeoImage')

// Opening a map
carte.on(['loading', 'read:start'], () => {
  dlgload.showWait('Chargement en cours...');
})

// Set info when read
let firstTime = true;
carte.on('read', () => {
  dlgload.hide();
  // Add current GeoImage
  carte.getMap().addLayer(carte.geoimage)
  // Get last position in localstorage
  if (firstTime) {
    let pos = localStorage.getItem('mc@editorPosition');
    if (pos) {
      pos = JSON.parse(pos);
      if (Array.isArray(pos)) {
        carte.getMap().getView().setCenter(pos);
        carte.getMap().getView().setZoom(pos[2]);
      }
    }
    firstTime = false;
    const draw = addControlPoints(carte.getMap())
    carte.controlPoints = draw.get('source');
  }
})

// Error reading map
carte.on('error', () => {
  dlgload.showAlert('Une erreur est survenue !<br/>Impossible de lire la carte...')
})

import template from './template.carte'
carte.read(template)

// Show / hide image on space key
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    if (/INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (document.querySelector('.ol-ext-dialog.ol-visible')) return;
    if (document.body.dataset.mega === '' || document.body.dataset.menu === '' ) return;
    carte.geoimage.setVisible(!carte.geoimage.getVisible())
    e.preventDefault()
  }
})

export default carte