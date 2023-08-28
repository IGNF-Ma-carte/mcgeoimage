import charte from 'mcutils/charte/macarte'
import helmert, { calcTransform } from '../georef/georef'
import { helpData } from 'mcutils/dialog/helpDialog'
import InputCollection from 'ol-ext/util/input/Collection'

import imageMap from '../map/imageMap'

import html from '../page/tabTransform.html'
import '../page/tab.css'

const tab = charte.addMenuTab('location', 'fi-geolocation', 'Transformer', html);
helpData(tab)

const inputSim = tab.querySelector('.similarity input')
inputSim.addEventListener('change', () => {
  helmert.similarity = inputSim.checked;
  calcTransform();
})

import { toLonLat } from 'ol/proj'
import { getDistance } from 'ol/sphere'
import ol_ext_element from 'ol-ext/util/element'

const table = tab.querySelector('table')

function updateTable() {
  table.innerHTML = '';
  const row = ol_ext_element.create('TR', { className: 'header', parent: table })
  ol_ext_element.create('TH', { text: '#', parent: row })
  ol_ext_element.create('TH', { text: 'Résidu (m)', parent: row })
  ol_ext_element.create('TH', { text: '', parent: row })
  if (imageMap.controlPoints) {
    const dist = []
    let moy = 0;
    imageMap.controlPoints.getFeatures().forEach((f,i) => {
      const f2 = f.get('control');
      if (f2 && helmert.hasControlPoints) {
        const p0 = toLonLat(helmert.transform(f.getGeometry().getCoordinates()))
        const p1 = toLonLat(f2.getGeometry().getCoordinates())
        const d = getDistance(p0,p1)
        dist.push(d);
        moy += d;
        const row = ol_ext_element.create('TR', { 'data-dist': d.toFixed(2), parent: table })
        ol_ext_element.create('TD', { text: i, parent: row })
        ol_ext_element.create('TD', { 
          className: 'number', 
          text: d.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }), 
          parent: row 
        })
        const bt = ol_ext_element.create('TD', { className: 'button', parent: row })
        ol_ext_element.create('I', {
          className: 'fi-visible',
          title: 'voir le point...',
          click: () => {
            imageMap.getMap().getView().setCenter(f.getGeometry().getCoordinates())
          },
          parent: bt
        })
        ol_ext_element.create('I', {
          className: 'fi-delete',
          title: 'supprimer ce point...',
          click: () => {
            imageMap.controlPoints.removeFeature(f)
            f.get('control').dispatchEvent({ type: 'delete' });
            // Calculate
            calcTransform();
          },
          parent: bt
        })
      }
    })
    // Etype
    if (dist.length) {
      moy /= dist.length;
      let etype = 0;
      dist.forEach(d => etype += Math.pow(d-moy, 2))
      etype = Math.sqrt(etype / dist.length)
      const max = moy + etype/3;
      // show errors
      table.querySelectorAll('tr').forEach(r => {
        if (r.dataset.dist > max) r.className = 'max';
      })
    }
  }
}
updateTable();
helmert.on('update', updateTable)

window.helmert = helmert
window.imageMap = imageMap