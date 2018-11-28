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
import {simpleEquals} from './ObjectUtils'
const kvsMap = {}
const rendererInvokes = {}
// const cbMap={}
const observerMap={}
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
const observers={}
function observeValue(key,cb){
    return new Promise((resolve,reject)=>{
        if(ipcRenderer){
            if(typeof key !=='string'){
                reject('key should be string')
                return
            }
            let id=guid.uuid()
            let winId=remote.getCurrentWindow().id
            observers[id]={cb,resolve,reject}
            ipcRenderer.send('observeValue',{key,id,winId})
        }
        else{
            reject('can only be invoked in renderer process')
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
  ipcMain.on('observeValue',(e,data)=>{
      let {id,winId,key}=data
      if(!(key in observerMap)){
        observerMap[key]=[]
      }
      observerMap[key].push({winId,id})
      let value
      if(key in kvsMap){
        value=kvsMap[key]
      }
      else{
          value=null
      }
      let win=BrowserWindow.fromId(winId)
      win&&win.send('observed',{id,value})
  })
  ipcMain.on('setGlobalValue', (e, data) => {
    let { key, value } = data
    let cb = ({ winId, id }) => {
      let win = BrowserWindow.fromId(winId)
      win&&win.webContents.send('setGlobalValueDone', id)
      
    }
    if(!simpleEquals(value,kvsMap[key])){
      if(key in observerMap){
        for(let observer of observerMap[key]){
            let {winId,id}=observer
            let win = BrowserWindow.fromId(winId)
            win&&win.webContents.send('valueUpdated', {id,value})
        }
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
  ipcRenderer.on('observed',(e,data)=>{
    let {id,value}=data
    if(id in observers){
        let {resolve}=observers[id]
        resolve(value)
    } 
  })
  ipcRenderer.on('valueUpdated',(e,data)=>{
    let {id,value}=data
    if(id in observers){
        let {cb}=observers[id]
        cb(value)
    }
  })
  ipcRenderer.on('getGlobalValueDone', (e, { id, val }) => {
    if (rendererInvokes[id]) {
      rendererInvokes[id](val)
    }
  })
}
export { setValue, getValue }
