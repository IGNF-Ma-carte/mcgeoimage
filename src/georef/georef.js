import Helmert from './Helmert'
import GeoImage from 'ol-ext/source/GeoImage'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import notification from 'mcutils/dialog/notification'

import carte from '../map/carte'
import imageMap from '../map/imageMap'
import '../map/mask'
import linkLayer from '../map/linkLayer'

const helmert = new Helmert();

let lastPx, lastPt
let loading = false;


function loadControlPoints(pts, l1, l2) {
  loading = true;
  pts.forEach(p => {
    const f1 = new Feature(new Point(p[0]))
    const f2 = new Feature(new Point(p[1]))
    // Set control pair
    f1.set('control', f2)
    f2.set('control', f1)
    // Add to layer
    l1.addFeature(f1)
    l2.addFeature(f2)
  })
  loading = false;
  calcTransform();
}

function setControlPair(f1, f2, layer) {
  if (layer) {
    f2 = new Feature(new Point(f2))
  }
  // Set control pair
  f1.set('control', f2)
  f2.set('control', f1)
  lastPt = lastPx = null;
  // Refresh
  if (layer) layer.addFeature(f2)
  calcTransform();
}

/* Control point matching */
imageMap.getMap().on('addControlPoint', e => {
  if (loading) return;
  if (lastPt && !lastPt.get('delete')) {
    setControlPair(e.feature, lastPt);
  } else if (helmert.hasControlPoints) {
    setControlPair(e.feature, helmert.transform(e.feature.getGeometry().getCoordinates()), carte.controlPoints);
  } else {
    lastPx = e.feature
  }
})
carte.getMap().on('addControlPoint', e => {
  if (loading) return;
  if (lastPx && !lastPx.get('delete')) {
    setControlPair(e.feature, lastPx);
  } else if (helmert.hasControlPoints) {
    setControlPair(e.feature, helmert.revers(e.feature.getGeometry().getCoordinates()), imageMap.controlPoints);
  } else {
    lastPt = e.feature
  }
})

// Update points
imageMap.getMap().on('updateControlPoint', calcTransform)
carte.getMap().on('updateControlPoint', calcTransform)

// Update mask
let mask = null;
imageMap.getMap().on('updateMask', e => {
  if (e.feature) {
    mask = e.feature.getGeometry().getCoordinates()[0];
    // Transform
    if (carte.geoimage.getSource()) {
      const projMask = [];
      mask.forEach(p => {
        projMask.push(helmert.transform(p))
      });
      carte.geoimage.getSource().setMask(projMask)
    }
  } else {
    mask = null;
    if (carte.geoimage.getSource()) carte.geoimage.getSource().setMask()
  }
})

/* Calculate transform */
function calcTransform() {
  const pts = imageMap.getControlPoints()
  console.log(pts)
  helmert.setControlPoints(pts[0], pts[1]);

  if (pts[0].length > 1) {

    // Get transform
    var sc = helmert.getScale();
    var a = helmert.getRotation();
    var t = helmert.getTranslation();

    const projMask = mask ? [] : null;
    if (mask) {
      mask.forEach(p => {
        projMask.push(helmert.transform(p))
      });
    }
    
    // Apply transform
    if (!carte.geoimage.getSource()) {
      const source = new  GeoImage({
        url: imageMap.getSource().getGeoImage().src,
        imageCenter: t,
        imageScale: sc,
        imageRotate: a,
        imageMask: projMask
      })
      carte.geoimage.setSource(source)
      // Show image
      carte.geoimage.setVisible(true)
      notification.show('Appuyez sur la touche <kbd>ESPACE</kbd> pour masquer la couche...')
    } else {
      const source = carte.geoimage.getSource();
      source.setRotation(a);
      source.setScale(sc);
      source.setCenter(t);
      source.setMask(projMask);
    }
    imageMap.getMap().getView().setRotation(a);
    // Show links
    const source = linkLayer.getSource()
    source.clear();
    if (pts[0].length > 2) {
      pts[0].forEach((p,i) => {
        const p2 = helmert.transform(p);
        source.addFeature(new Feature(new Point(p2)));
        source.addFeature(new Feature(new LineString([p2, pts[1][i]])))
      })
    }
  } else {
    // Remove source
    carte.geoimage.setSource(null);
  }
}

// Synchronize maps
let preventMove = false
carte.getMap().getView().on('change:center', e => {
  if (!preventMove && helmert.hasControlPoints) {
    preventMove = true
    imageMap.getMap().getView().setCenter(helmert.revers(e.target.getCenter()))
    preventMove = false
  }
})
imageMap.getMap().getView().on('change:center', e => {
  if (!preventMove && helmert.hasControlPoints) {
    preventMove = true
    carte.getMap().getView().setCenter(helmert.transform(e.target.getCenter()))
    preventMove = false
  }
})

export { calcTransform, loadControlPoints }
export default helmert