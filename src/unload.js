import loadFonts from 'mcutils/font/loadFonts';
import _T from 'mcutils/i18n/i18n'
import carte from "./map/carte";


// Prevent unload
let dirty = false;
window.onbeforeunload = function() {
//  console.log('BEFOREUNLOAD', dirty)
  // Set last position in localstorage
  const pos = carte.getMap().getView().getCenter().slice();
  pos.push(carte.getMap().getView().getZoom())
  localStorage.setItem('mc@editorPosition', JSON.stringify(pos));
  // is map dirty
  return dirty ? _T('hasChanged') : null;
}

/**
 * Returns true if any modifcations occurs on the map.
 * @param {*} b 
 * @returns 
 */
function setDirty(b) {
  if (b === dirty) return;
  if (b) {
    dirty = true;
    if (!/ ●$/.test(document.title)) document.title = document.title + ' ●';
  } else {
    setTimeout(() => { 
      dirty = false;
      document.title = document.title.replace(/ ●$/, ''); 
    }, 500)
  }
}

/* Handle map modifications */
carte.on('change', () => setDirty(true));
carte.getMap().getLayerGroup().on('change', () => setDirty(true));
carte.on(['read', 'save'], () => setDirty(false));
loadFonts(() => setDirty(false))

/* Map has changed */
carte.hasChanged = function() {
  return dirty;
}

export default dirty;