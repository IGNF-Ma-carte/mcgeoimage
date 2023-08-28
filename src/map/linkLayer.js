import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Circle from 'ol/style/Circle'
import Stroke from 'ol/style/Stroke'

import carte from './carte'

const linkLayer = new VectorLayer({ 
  source: new VectorSource,
  style: new Style({
    image: new Circle({
      radius: 4,
      stroke: new Stroke({
        color: '#fa0',
        width: 2
      })
    }),
    stroke: new Stroke({
      color: '#fa0',
      width: 2
    })
  })
});

linkLayer.setMap(carte.getMap())

export default linkLayer