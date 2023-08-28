import Map from 'ol/Map'
import View from 'ol/View'
import Projection from 'ol/proj/Projection'
import { defaults as defaultControls } from 'ol/control'
import { defaults as defaultInteractions } from 'ol/interaction'
import ol_ext_element from 'ol-ext/util/element'
import charte from 'mcutils/charte/macarte'
import LayerImage from 'ol/layer/Image'
import GeoImage from 'ol-ext/source/GeoImage'
import dialog from 'mcutils/dialog/dialog'
import carte from './carte'

import addControlPoints from '../georef/controlPoints'

// Pixel projection 
const pixelProjection = new Projection({
  code: 'pixel',
  units: 'pixels',
  extent: [-100000, -100000, 100000, 100000]
});

// Map for the image
const map = new Map ({	
  target: ol_ext_element.create('DIV', {
    'data-role': 'image',
    parent: charte.getAppElement()
  }),
  view: new View ({
    projection: pixelProjection,
    zoom: 7,
    center: [0,0]
  }),
  controls: defaultControls( { rotateControl:false,  attributionControl:false } ),
  interactions: defaultInteractions( { altShiftDragRotate:false, pinchRotate:false } )
});

// Layer image
const layer = new LayerImage()
map.addLayer(layer)

/** Set image source
 * @param {string} url
 */
function setSource(url) {
  const source = new GeoImage({
    url: url,
    imageCenter: [0,0],
    imageScale: [1,1],
    projection: pixelProjection
  })
  const img = source.getGeoImage()
  img.addEventListener('load', () => {
    map.getView().fit(source.getExtent())
  })
  img.addEventListener('error', () => {
    dialog.showAlert('Impossible d\'accéder à l\'image')
  })
  layer.setSource(source)
  // Title
  let title = url.split('/').pop();
  const p = title.lastIndexOf('.')
  if (p>0) title = title.substring(0, p);
  carte.geoimage.set('title', title);
  return source;
}

// Add control points layer
const draw = addControlPoints(map)
const source = draw.get('source')

export { draw }

// Toggle map
import Toggle from 'ol-ext/control/Toggle'
map.addControl(new Toggle({
  className: 'fullpage',
  title: 'pleine page',
  onToggle: b => {
    if (b) document.body.dataset.fullpage = '';
    else delete document.body.dataset.fullpage;
    map.updateSize();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500)
  }
}))

/** Image map
 */
export default {
  getMap: () => map,
  getControlPoints: () => {
    const px = [];
    const pt = []
    source.getFeatures().forEach(f => {
      if (f.get('control')) {
        px.push(f.getGeometry().getCoordinates())
        pt.push(f.get('control').getGeometry().getCoordinates())
      }
    })
    return [px,pt];
  },
  controlPoints: source,
  setSource,
  layer: layer,
  getSource: () => layer.getSource()
}