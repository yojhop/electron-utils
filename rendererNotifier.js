/*
 * @Author: OBKoro1
 * @Github: https://github.com/OBKoro1
 * @Date: 2018-11-21 11:43:59
 * @LastEditors: Amos
 * @LastEditTime: 2019-01-25 12:35:56
 * @Description: 设置全局变量/获取全局变量,在设置完成之后做些事情
 * @export: 设置全局变量和获取全局变量
 */
import { ipcMain, ipcRenderer, remote, BrowserWindow } from 'electron'
import { Promise } from 'bluebird-lst'
import { guid } from '../renderer/assets/libs/remoteInvoker/uuid'
import { simpleEquals } from '../renderer/utils/objectUtils'
const kvsMap = {}
const rendererInvokes = {}
// const cbMap={}
const observersMap = {}
const delaySetMap = {}
const onceInitMap = {}
function inform(key) {
  return new Promise((resolve, reject) => {
    if (ipcRenderer) {
      let winId = remote.getCurrentWindow().id
      const id = guid.uuid()
      rendererInvokes[id] = () => {
        resolve()
      }
      ipcRenderer.send('inform', { key, winId, id })
    } else {
      reject('set function can only be invoked in renderer process')
    }
  })
}
function delaySetValue(key, value, delay) {
  return new Promise((resolve, reject) => {
    if (ipcRenderer) {
      let winId = remote.getCurrentWindow().id
      const id = guid.uuid()
      rendererInvokes[id] = () => {
        resolve()
      }
      ipcRenderer.send('delaySetGlobalValue', { key, value, winId, id, delay })
    } else {
      reject('delaySetValue function can only be invoked in renderer process')
    }
  })
}
function cancelDelaySetValue(timeoutId) {
  return new Promise((resolve, reject) => {
    if (ipcRenderer) {
      let winId = remote.getCurrentWindow().id
      const id = guid.uuid()
      rendererInvokes[id] = () => {
        resolve()
      }
      ipcRenderer.send('cancelDelaySetValue', { winId, id, timeoutId })
    } else {
      reject('cancelDelaySetValue function can only be invoked in renderer process')
    }
  })
}
function cancelDelaySet(key) {
  return new Promise((resolve, reject) => {
    if (ipcRenderer) {
      let winId = remote.getCurrentWindow().id
      const id = guid.uuid()
      rendererInvokes[id] = () => {
        resolve()
      }
      ipcRenderer.send('cancelDelaySet', { winId, id, key })
    } else {
      reject('cancelDelaySet function can only be invoked in renderer process')
    }
  })
}
const observers = {}
function observeInformer(key, cb) {
  return new Promise((resolve, reject) => {
    if (ipcRenderer) {
      if (typeof key !== 'string') {
        reject('key should be string')
        return
      }
      let id = guid.uuid()
      let winId = remote.getCurrentWindow().id
      observers[id] = { cb, resolve, reject }
      ipcRenderer.send('observeInformer', { key, id, winId })
    } else {
      reject('can only be invoked in renderer process')
    }
  })
}
function onceInit(key){
  return new Promise((resolve, reject) => {
    if (ipcRenderer) {
      let winId = remote.getCurrentWindow().id
      const id = guid.uuid()
      rendererInvokes[id] = (val) => {
        resolve(val)
      }
      ipcRenderer.send('onceInitGlobalValue', { key, winId, id })
    } else {
      reject('get function can only be invoked in renderer process')
    }
  })
}
function getValue(key) {
  return new Promise((resolve, reject) => {
    if (ipcRenderer) {
      let winId = remote.getCurrentWindow().id
      const id = guid.uuid()
      rendererInvokes[id] = (val) => {
        resolve(val)
      }
      ipcRenderer.send('getGlobalValue', { key, winId, id })
    } else {
      reject('get function can only be invoked in renderer process')
    }
  })
}
if (ipcMain) {
  ipcMain.on('observeInformer', (e, data) => {
    let { id, winId, key } = data
    if (!(key in observersMap)) {
      observersMap[key] = []
    }
    observersMap[key].push({ winId, id })
    let win = BrowserWindow.fromId(winId)
    win && win.send('informerObserved', { id })
  })
  ipcMain.on('inform', (e, data) => {
    let { key } = data
    let cb = ({ winId, id }) => {
      let win = BrowserWindow.fromId(winId)
      win && win.webContents.send('informDone', id)
    }
    if (key in observersMap) {
        for (let observer of observersMap[key]) {
            let { winId, id } = observer
            let win = BrowserWindow.fromId(winId)
            win && win.webContents.send('informed', { id })
        }
    }
    cb(data)
  })
  ipcMain.on('cancelDelaySetValue', (e, data) => {
    let cb = ({ winId, id, timeoutId }) => {
      let win = BrowserWindow.fromId(winId)
      win && win.webContents.send('cancelDelaySetValueDone', { id })
    }
    clearTimeout(data.timeoutId)
    cb(data)
  })
  ipcMain.on('cancelDelaySet', (e, data) => {
    let cb = ({ winId, id }) => {
      let win = BrowserWindow.fromId(winId)
      win && win.webContents.send('cancelDelaySetDone', { id })
    }
    if (data.key in delaySetMap) {
      for (let id of delaySetMap[data.key]) clearTimeout(id)
    }
    cb(data)
  })
  ipcMain.on('delaySetGlobalValue', (e, data) => {
    let { key, value, delay } = data
    let cb = ({ winId, id, timeoutId }) => {
      let win = BrowserWindow.fromId(winId)
      win && win.webContents.send('delaySetGlobalValueDone', { id, timeoutId })
    }
    let timeoutId = setTimeout(() => {
      if (!simpleEquals(value, kvsMap[key])) {
        if (key in observersMap) {
          for (let observer of observersMap[key]) {
            let { winId, id } = observer
            let win = BrowserWindow.fromId(winId)
            win && win.webContents.send('valueUpdated', { id, value })
          }
        }
      }
      kvsMap[key] = value
    }, delay)
    if (!(key in delaySetMap)) {
      delaySetMap[key] = []
    }
    delaySetMap[key].push(timeoutId)
    data.timeoutId = timeoutId
    cb(data)
  })
  ipcMain.on('getGlobalValue', (e, data) => {
    let cb = ({ winId, id, val }) => {
      let win = BrowserWindow.fromId(winId)
      if (win) {
        win.webContents.send('getGlobalValueDone', { id, val })
      }
    }
    data.val = data.key in kvsMap ? kvsMap[data.key] : null
    cb(data)
  })
  ipcMain.on('onceInitGlobalValue',(e,data)=>{
    let cb = ({ winId, id, val }) => {
      let win = BrowserWindow.fromId(winId)
      if (win) {
        win.webContents.send('onceInitGlobalValueDone', { id, val })
      }
    }
    if(data.key in kvsMap){
      data.val=kvsMap[data.key]
      cb(data)
    }
    else{
      if(!(key in onceInitMap)) onceInitMap[key]=[]
      onceInitMap[key].push({winId,id})
    }
  })
}
if (ipcRenderer) {
  ipcRenderer.on('informDone', (e, id) => {
    if (rendererInvokes[id]) {
      rendererInvokes[id]()
    }
  })
  ipcRenderer.on('delaySetGlobalValueDone', (e, data) => {
    let { id, timeoutId } = data
    if (rendererInvokes[id]) {
      rendererInvokes[id](timeoutId)
    }
  })
  ipcRenderer.on('cancelDelaySetDone', (e, data) => {
    let { id } = data
    if (rendererInvokes[id]) {
      rendererInvokes[id]()
    }
  })
  ipcRenderer.on('cancelDelaySetValueDone', (e, data) => {
    let { id } = data
    if (rendererInvokes[id]) {
      rendererInvokes[id]()
    }
  })
  ipcRenderer.on('informerObserved', (e, data) => {
    let { id } = data
    if (id in observers) {
      let { resolve } = observers[id]
      resolve()
    }
  })
  ipcRenderer.on('informed', (e, data) => {
    let { id } = data
    if (id in observers) {
      let { cb } = observers[id]
      cb()
    }
  })
  ipcRenderer.on('getGlobalValueDone', (e, { id, val }) => {
    if (rendererInvokes[id]) {
      rendererInvokes[id](val)
    }
  })
  ipcRenderer.on('onceInitGlobalValueDone', (e, { id, val }) => {
    if (rendererInvokes[id]) {
      rendererInvokes[id](val)
    }
  })
}
export { setValue, getValue, observeValue, delaySetValue, cancelDelaySet, cancelDelaySetValue }