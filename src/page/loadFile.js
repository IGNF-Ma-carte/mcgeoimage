import ol_ext_element from 'ol-ext/util/element'
import imageMap from '../map/imageMap'

import loadFile from './loadFile-page.html'

import './loadFile.css'
import carte from '../map/carte'

const page = ol_ext_element.create('DIV', {
  html: loadFile,
  id: 'loadFile',
  parent: document.body
})

// url input
const inputUrl = page.querySelector('input');
setTimeout(() => inputUrl.focus(), 100)

// Test image before run
const img = page.querySelector('img')
img.onload = () => {
  setTimeout(() => {
    imageMap.setSource(img.src)
    page.dataset.hidden = '';
    delete document.body.dataset.loading
  }, 500)
}
img.onerror = () => {
  page.dataset.error = ''
  delete document.body.dataset.loading
}

// Load button
const loadBt = page.querySelector('button')
loadBt.addEventListener('click', () => {
  delete page.dataset.error
  const url = inputUrl.value
  if (url) {
    img.src = url
    document.body.dataset.loading = ''
  } else {
    inputUrl.required = true
    inputUrl.focus();
  }
})

// Examples
const select = page.querySelector('select')
select.addEventListener('change', () => {
  img.src = select.value
  if (/paris/i.test(select.value)) {
    carte.getMap().getView().fit([249701, 6242605, 269656, 6259972])
  } else if (/PVA/.test(select.value)) {
    carte.getMap().getView().fit([273738, 6242396, 276871, 6245123])
  }
})
