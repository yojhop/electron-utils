/*
 * @Author: OBKoro1
 * @Github: https://github.com/OBKoro1
 * @Date: 2018-11-21 11:43:59
 * @LastEditors: Amos
 * @LastEditTime: 2019-01-24 16:43:06
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
const observerMap = {}
const delaySetMap = {}
const onceInitMap = {}
function setValue(key, value) {
  return new Promise((resolve, reject) => {
    if (ipcRenderer) {
      let winId = remote.getCurrentWindow().id
      const id = guid.uuid()
      rendererInvokes[id] = () => {
        resolve()
      }

      ipcRenderer.send('setGlobalValue', { key, value, winId, id })
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
function observeValue(key, cb) {
  return new Promise((resolve, reject) => {
    if (ipcRenderer) {
      if (typeof key !== 'string') {
        reject('key should be string')
        return
      }
      let id = guid.uuid()
      let winId = remote.getCurrentWindow().id
      observers[id] = { cb, resolve, reject }
      ipcRenderer.send('observeValue', { key, id, winId })
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
  ipcMain.on('observeValue', (e, data) => {
    let { id, winId, key } = data
    if (!(key in observerMap)) {
      observerMap[key] = []
    }
    observerMap[key].push({ winId, id })
    let value
    if (key in kvsMap) {
      value = kvsMap[key]
    } else {
      value = null
    }
    let win = BrowserWindow.fromId(winId)
    win && win.send('observed', { id, value })
  })
  ipcMain.on('setGlobalValue', (e, data) => {
    let { key, value } = data
    let cb = ({ winId, id }) => {
      let win = BrowserWindow.fromId(winId)
      win && win.webContents.send('setGlobalValueDone', id)
    }
    if (!simpleEquals(value, kvsMap[key])) {
      if (key in observerMap) {
        for (let observer of observerMap[key]) {
          let { winId, id } = observer
          let win = BrowserWindow.fromId(winId)
          win && win.webContents.send('valueUpdated', { id, value })
        }
      }
      if(key in onceInitMap){
        for (let onceIniter of onceInitMap[key]) {
          let { winId, id } = onceIniter
          let win = BrowserWindow.fromId(winId)
          win && win.webContents.send('onceInitGlobalValueDone', { id, value })
        }
      }
    }
    kvsMap[key] = value
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
        if (key in observerMap) {
          for (let observer of observerMap[key]) {
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
  ipcRenderer.on('setGlobalValueDone', (e, id) => {
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
  ipcRenderer.on('observed', (e, data) => {
    let { id, value } = data
    if (id in observers) {
      let { resolve } = observers[id]
      resolve(value)
    }
  })
  ipcRenderer.on('valueUpdated', (e, data) => {
    let { id, value } = data
    if (id in observers) {
      let { cb } = observers[id]
      cb(value)
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
