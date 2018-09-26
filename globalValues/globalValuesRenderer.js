import { ipcRenderer } from 'electron'
const valsMap = {}
let inited = false
export function updateRenderer(key, val) {
  ipcRenderer.send('updateGlobalValue', { key: key, val: val })
}

function initKey(key, val) {
  if (!valsMap[key]) {
    return true
  }
  if (!valsMap[key].inited) {
    valsMap[key].inited = true
    valsMap[key].ctx[key] = val
    if (valsMap[key].initCb) {
      valsMap[key].initCb()
    }
    return true
  }
  return false
}

function init() {
  ipcRenderer.on('initGlobalValueRet', (e, kv) => {
    initKey(kv.key, kv.val)
  })
  ipcRenderer.on('glabalValuesUpdate', (event, kv) => {
    if (!initKey()) {
      if (valsMap[kv.key]) {
        valsMap[kv.key].ctx[kv.key] = kv.val
      }
    }
  })
}
export function mapRenderer(ctx, name, initCb) {
  if (!inited) {
    init()
    inited = true
  }
  valsMap[name] = { ctx: ctx, name: name, initCb: initCb, inited: false }
  ctx[name] = null
  ipcRenderer.send('initGlobalValue', name)
  ipcRenderer.send('subGlobalValues', name)
}
