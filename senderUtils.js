// 如果ipcRenderer不为空为渲染进程，如果ipcMain非空为主进程

import {ipcRenderer,ipcMain,BrowserWindow} from 'electron'
function getProcessType(){
    if(ipcRenderer){
        return 'renderer'
    }
    else if(ipcMain){
        return 'main'
    }
    return 'unknown'
}
function getSender(processType,receiverId){
    // 如果当前为渲染进程，则用ipcRenderer发往主进程
    if(processType==='renderer'){
        return ipcRenderer
    }
    // 如果当前为主进程，则用receiverId获得对应窗口的webContents
    else if(processType==='main'){
        let win=BrowserWindow.fromId(receiverId)
        if(win) return win.webContents
    }
    return null
    
}
function validateProcess(processType){
    if(processType==='renderer'||processType==='main') return true
    return false
}
export {getProcessType,getSender,validateProcess}