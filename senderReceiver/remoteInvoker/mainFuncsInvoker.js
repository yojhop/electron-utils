import { guid } from './uuid'
import { ipcMain, ipcRenderer } from 'electron'
const registedFuncs = {}
function registerInMain(mod) {
  if (isMain()) {
    for (let name in mod) {
      if (Object.prototype.toString.call(mod[name]) === '[object Function]') {
        registedFuncs[name] = mod[name]
      }
    }
  }
}
function isMain() {
  return typeof ipcMain !== 'undefined'
}
const invokes = {}
function invokeMainFunc({ id, name, args }) {
  if (typeof id === 'undefined') id = guid.uuid()
  return new Promise((resolve, reject) => {
    // console.log('ipcRenderer', ipcRenderer, id)
    if (ipcRenderer) {
      let callback = (ret) => {
        resolve(ret)
      }
      let errCallback = (err) => {
        reject(err)
      }
      invokes[id] = { callback, errCallback }
      ipcRenderer.send('remoteInvoke', { name, id, args })
      console.log({ name, id, args, callback }, 'sent')
    } else {
      reject({ message: 'no ipcRenderer', code: 'NO_IPCRENDERER' })
    }
  })
}
ipcRenderer && ipcRenderer.on('remoteCallback', (event, data) => {
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
ipcMain && ipcMain.on('remoteInvoke', (event, data) => {
  console.log('got remoteinvoke', data, registedFuncs)
  if (!registedFuncs[data.name]) {
    event.sender.send('remoteCallback', { id: data['id'], 'error': 'remote function not found', code: 'error' })
    return
  }
  try {
    let ret
    if (data.args) {
      ret = registedFuncs[data.name](data.args)
    } else {
      ret = registedFuncs[data.name]()
    }
    console.log('invoke ret', ret)

    if (Object.prototype.toString.call(ret) === '[object Promise]') {
      ret.then(res => {
        event.sender.send('remoteCallback', { id: data['id'], 'args': res, code: 'success' })
      }).catch(err => {
        event.sender.send('remoteCallback', { id: data['id'], 'error': err, code: 'error' })
      })
    } else {
      event.sender.send('remoteCallback', { id: data['id'], 'args': ret, code: 'success' })
    }
  } catch (err) {
    event.sender.send('remoteCallback', { id: data['id'], 'error': err, code: 'error' })
  }
})

export { registerInMain, invokeMainFunc }
