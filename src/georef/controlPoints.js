import Collection from 'ol/Collection'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Circle from 'ol/style/Circle'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import Draw from 'ol/interaction/Draw'
import Modify from 'ol/interaction/Modify'
import { altKeyOnly, shiftKeyOnly, singleClick } from 'ol/events/condition'

// Styles
const redPt = new Style({
  image: new Circle({
    radius: 8,
    stroke: new Stroke({
      color: '#f00',
      width: 2
    }),
    fill: new Fill({
      color: 'rgba(255,255,255,.5)'
    })
  })
});
const blackPt = new Style({
  image: new Circle({
    radius: 8,
    stroke: new Stroke({
      color: '#000',
      width: 1
    })
  })
});

/** Add a layer with control points
 * @param {ol/Map} map
 * @returns {ol/interaction/Draw} 
 */
function addControlPoints(map) {
  // Control points layer
  var vector = new VectorLayer({
    name: 'Control',
    source: new VectorSource(),
    style: redPt
  })
  //map.addLayer(vector);
  vector.setMap(map)

  // Draw interaction
  const draw = new Draw({
    type: 'Point',
    source: vector.getSource(),
    condition: () => {
      return (!lastPt || lastPt.get('control'))
    },
    style: () => {
      return (!lastPt || lastPt.get('control') ? blackPt : [])
    }
  })
  map.addInteraction(draw)
  draw.set('source', vector.getSource())

  // Last point
  let lastPt;
  vector.getSource().on('addfeature', (e) => {
    const f = lastPt = e.feature
    f.on('delete', () => {
      vector.getSource().removeFeature(f)
    })
    if (!f.get('control')) {
      map.dispatchEvent({
        type: 'addControlPoint',
        feature: e.feature
      })
    }
  })

  // Modify interaction
  const modify = new Modify({
    source: vector.getSource()
  });
  modify.on('modifyend', e => {
    const f = e.features.item(0)
    map.dispatchEvent({
      type: 'updateControlPoint',
      feature: f
    })
  })
  map.addInteraction(modify);

  // Delete interaction
  map.on('click', function(e) {
    if (altKeyOnly(e)) {
      var features = map.getFeaturesAtPixel(e.pixel, {
        layerFilter: l => l === vector
      });
      const feature = features[0];
      if (feature) {
        // Remove feature
        vector.getSource().removeFeature(feature);
        feature.set('delete', true)
        if (feature === lastPt) {
          lastPt = null
        }
        // Remove pair
        if (feature.get('control')) {
          feature.get('control').dispatchEvent({ type: 'delete' });
        }
        // Calculate
        map.dispatchEvent({
          type: 'updateControlPoint',
        })
      }
    }
  })

  // Vector
  return draw
}

export default addControlPoints