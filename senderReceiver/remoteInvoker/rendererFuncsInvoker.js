import { guid } from './uuid'
import { ipcMain, ipcRenderer, BrowserWindow } from 'electron'
const registedFuncs = {}
function registerInRenderer(mod) {
  if (isRenderer()) {
    for (let name in mod) {
      if (Object.prototype.toString.call(mod[name]) === '[object Function]') {
        registedFuncs[name] = mod[name]
      }
    }
  }
}
function isRenderer() {
  return typeof ipcRenderer !== 'undefined'
}
const invokes = {}

function invokeRendererFunc({ winId, id, name, args }) {
  if (typeof id === 'undefined') id = guid.uuid()
  return new Promise((resolve, reject) => {
    // console.log('ipcRenderer',ipcRenderer,id)
    const win = BrowserWindow.fromId(winId)
    if (win) {
      let callback = (ret) => {
        resolve(ret)
      }
      let errCallback = (err) => {
        reject(err)
      }
      invokes[id] = { callback, errCallback }
      win.webContents.send('rendererInvoke', { id, name, args })
      // console.log({ name, id, args }, 'sent')
    } else {
      reject({ message: 'no window', code: 'NO_WINDOW_FOUND' })
    }
  })
}
ipcRenderer && ipcRenderer.on('rendererInvoke', (event, data) => {
  let { id, name, args } = data
  if (registedFuncs[name]) {
    let ret
    // console.log('invoking', name, ...args)
    if (args) {
      ret = registedFuncs[name](...args)
    } else {
      ret = registedFuncs[name]()
    }
    if (Object.prototype.toString.call(ret) === '[object Promise]') {
      ret.then(res => {
        // console.log('sending rendererCallback', res)
        event.sender.send('rendererCallback', { id, 'args': res, code: 'success' })
      }).catch(err => {
        // console.log('sending rendererCallback error', err)
        event.sender.send('rendererCallback', { id, 'error': err, code: 'error' })
      })
    } else {
      event.sender.send('rendererCallback', { id, 'args': ret, code: 'success' })
    }
  } else {
    // console.log('function not found for', data)
    event.sender.send('rendererCallback', { id, 'error': { message: `renderer function ${name} not found`, code: 'FUNCTION_NOT_FOUND' }, code: 'error' })
  }
})
ipcMain && ipcMain.on('rendererCallback', (event, data) => {
  if (data.id && invokes[data.id]) {
    if (data.code === 'success') {
      if (typeof data.args !== 'undefined') {
        invokes[data.id]['callback'](data.args)
      } else {
        invokes[data.id]['callback']()
      }
    } else if (data.code === 'error') {
      if (data.error) {
        invokes[data.id]['errCallback'](data.error)
      } else {
        invokes[data.id]['errCallback']()
      }
    }
  }
})
export { registerInRenderer, invokeRendererFunc }
