// Mask
import DrawInteraction from 'ol/interaction/Draw'
import Modify from 'ol/interaction/Modify'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Toggle from 'ol-ext/control/Toggle'

import imageMap from './imageMap'
import { draw } from './imageMap'

const map = imageMap.getMap();

// Mask
const mask = new VectorLayer({ 
  source: new VectorSource,
  style: new Style({
    stroke: new Stroke({ color: '#3993f3', width: 1.5 })
  })
})
// map.addLayer(mask)
mask.setMap(map)

// Reset on clear
mask.getSource().on('clear', () => {
  map.dispatchEvent({
    type: 'updateMask',
    feature: null
  })
  tmask.setDisable(false);
})

// draw interaction
import Tooltip from 'ol-ext/overlay/Tooltip'
const drawMask = new DrawInteraction({ type: 'Polygon', source: mask.getSource() })
const tip = new Tooltip()
tip.setInfo('Saisissez un polygone de masque')
drawMask.on('change:active', () => {
  draw.setActive(!drawMask.getActive())
  if (drawMask.getActive()) {
    // notification.show('Saisissez un polygone sur l\'image (à gauche)')
    map.addOverlay(tip)
  } else {
    map.removeOverlay(tip)
  }

})
drawMask.on('drawend', (e) => {
  drawMask.setActive(false);
  tmask.setDisable(true);
  map.dispatchEvent({
    type: 'updateMask',
    feature: e.feature
  })
})
drawMask.setActive(false)

// Toogle control
const tmask = new Toggle({ 
  className: 'mask',
  title: 'Ajouter un masque...',
  html: '<i class="fa fa-crop"></i>',
  interaction: drawMask 
})
map.addControl(tmask)

// Modify mask interaction
const modify = new Modify({
  source: mask.getSource()
});
modify.on('modifyend', e => {
  const f = e.features.item(0)
  map.dispatchEvent({
    type: 'updateMask',
    feature: f
  })
})
map.addInteraction(modify);

export default mask