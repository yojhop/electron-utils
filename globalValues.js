/*
 * @Author: OBKoro1
 * @Github: https://github.com/OBKoro1
 * @Date: 2018-11-21 11:43:59
 * @LastEditors: OBKoro1
 * @LastEditTime: 2018-11-22 15:55:57
 * @Description: 设置全局变量/获取全局变量,在设置完成之后做些事情
 * @export: 设置全局变量和获取全局变量
 */
import { ipcMain, ipcRenderer, remote, BrowserWindow } from 'electron'
import { Promise } from 'bluebird-lst'
import { guid } from '../renderer/assets/libs/remoteInvoker/uuid'
const kvsMap = {}
const rendererInvokes = {}
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
  ipcMain.on('setGlobalValue', (e, data) => {
    let { key, value } = data
    let cb = ({ winId, id }) => {
      let win = BrowserWindow.fromId(winId)
      if (win) {
        win.webContents.send('setGlobalValueDone', id)
      }
    }
    kvsMap[key] = value
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
}
if (ipcRenderer) {
  ipcRenderer.on('setGlobalValueDone', (e, id) => {
    if (rendererInvokes[id]) {
      rendererInvokes[id]()
    }
  })
  ipcRenderer.on('getGlobalValueDone', (e, { id, val }) => {
    if (rendererInvokes[id]) {
      rendererInvokes[id](val)
    }
  })
}
export { setValue, getValue }
