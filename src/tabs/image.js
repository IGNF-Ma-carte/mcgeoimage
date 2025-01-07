import charte from 'mcutils/charte/macarte'
import { helpData } from 'mcutils/dialog/helpDialog'
import GeoImage from 'mcutils/format/layer/GeoImage'
import notification from 'mcutils/dialog/notification'

import tabHTML from '../page/tabImage-page.html'
import '../page/tabImage.css'

const tab = charte.addMenuTab('image', 'fi-image', 'Image', tabHTML);
helpData(tab)

const uploadDiv = tab.querySelector('.upload')
uploadDiv.addEventListener('dragleave', () => delete uploadDiv.dataset.hover);
uploadDiv.addEventListener('drop', () => delete uploadDiv.dataset.hover);
uploadDiv.addEventListener('dragover', () => uploadDiv.dataset.hover = '');

// Drop an overlay map
tab.querySelector('.upload input[type="file"]').addEventListener('change', function(e) {
  const file = this.files[0]
  delete uploadDiv.dataset.hover;
  if (file) {
    var reader = new FileReader();
    reader.onload = function () {
      const c = JSON.parse(reader.result);
      let count = 0;
      c.layers.forEach(l => {
        const format = new GeoImage;
        const img = format.read(l)
        if (img) {
          const layers = carte.getMap().getLayers()
          layers.insertAt(layers.getLength() -1, img)
          count++;
        }
        if (count) {
          notification.show(count + (count>1 ? ' calques chargés.' : ' calque chargé.'))
        } else {
          notification.show('aucune donnée...')
        }
      })
    }
    // Load
    reader.readAsText(file);
  }
})
