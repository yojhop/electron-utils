import { ipcMain } from 'electron'
const listeners = {}
const kvMap = {}
const valsMap = {}
// export function listen (key, bw) {
//   console.log('subscribe', key)
//   if (!listeners.hasOwnProperty(key)) {
//     listeners[key] = []
//   }
//   listeners[key].push(bw)
//   console.log('listeners', listeners)
// }
export function startGlobalValues() {
  ipcMain.on('subGlobalValues', (event, key) => {
    if (!listeners.hasOwnProperty(key)) {
      listeners[key] = []
    }
    if (!listeners[key].includes(event.sender)) {
      listeners[key].push(event.sender)
    }
    if (key in kvMap) {
      event.sender.send('glabalValuesUpdate', { key: key, value: kvMap[key] })
    }
    // console.log('listeners', listeners)
  })
  ipcMain.on('updateGlobalValue', (event, kv) => {
    update(kv.key, kv.val)
  })
  ipcMain.on('initGlobalValue', (e, key) => {
    const val = key in kvMap ? kvMap[key] : null
    e.sender.send('initGlobalValueRet', { key: key, val: val })
  })
}
export function update(key, val) {
  kvMap[key] = val
  if (listeners.hasOwnProperty(key)) {
    for (const i in listeners[key]) {
      listeners[key][i].send('glabalValuesUpdate', { key: key, val: val })
    }
  }
}
export function mapMain(ctx, key) {
  valsMap[key] = { ctx, key }
  if (key in kvMap) {
    ctx[key] = kvMap[key]
  } else {
    ctx[key] = null
  }
}
export function updateMain(key, val) {
  update(key, val)
  if (valsMap[key]) {
    valsMap[key].ctx[key] = val
  }
}
