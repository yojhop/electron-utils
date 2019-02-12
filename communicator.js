import { remote, ipcMain, ipcRenderer, BrowserWindow } from 'electron'
import { puid } from './uuid'
const processType = getProcessType()
let winId = null
if (processType === 'renderer') winId = remote.getCurrentWindow().id
let subscribed = false
// 无意义字符串，用来验证消息由通讯模块发起
const communicateKey = '1tokent0communicatekey'
function getProcessType() {
  if (ipcRenderer) {
    return 'renderer'
  } else if (ipcMain) {
    return 'main'
  }
  return 'unknown'
}
function getSender(processType, receiverId) {
  // 如果当前为渲染进程，则用ipcRenderer发往主进程
  if (processType === 'renderer') {
    return ipcRenderer
  } else if (processType === 'main') { // 如果当前为主进程，则用receiverId获得对应窗口的webContents
    let win = BrowserWindow.fromId(receiverId)
    if (win) return win.webContents
  }
  return null
}
function validateProcess(processType) {
  if (processType === 'renderer' || processType === 'main') return true
  return false
}
// 通讯类
// 包含监听方法，结束方法，结束方法调用通讯模块的结束监听回调，发送方法，如果由被接收方结束则会调用已结束方法通知发起方

class Communication {
  constructor({ seriesId, rSeriesId, receiverId, senderId, initCb }) {
    this.seriesId = seriesId
    this.communicateKey = communicateKey
    this.receiverId = receiverId
    this.senderId = senderId
    this.status = 'initing'
    this.rSeriesId = rSeriesId
    this.communicateId = `${this.senderId}-${this.seriesId !== null ? this.seriesId : this.rSeriesId}-${this.receiverId}`
    this.initCb = initCb
    this.curId = processType === 'main' ? 'main' : winId
  }
  end() {
    this.status = 'ended'
  }
  initDone() {
    this.status = 'inited'
    this.initCb && this.initCb(this)
  }
  send(message) {
    let senderId = this.curId
    let receiverId
    if (this.curId === this.receiverId) receiverId = this.senderId
    else receiverId = this.receiverId
    let sender = getSender(processType, receiverId)
    if (sender) {
      sender.send('communicate', { message,
        communicateKey: this.communicateKey,
        seriesId: this.seriesId,
        receiverId,
        senderId,
        operation: 'message' })
    } else console.log('sender is null')
  }
  onMessage(cb) {
    this.messageCb = cb
  }
  messageCb(message) {
    this.messageCb(message)
  }
}

// 通讯模块
let communicationsMap = {}
// 初始化通讯方法，接受者类型，如果接收方为渲染进程还需Id，返回通讯对象，标识符为发起方标识符(主进程为'main',渲染进程为进程Id)+发起方累加Id
function initCommunication(receiverId) {
  return new Promise((resolve, reject) => {
    if (!validateProcess(processType)) {
      reject('not valid process')
      return
    }
    let senderId = null
    let seriesId = null
    let rSeriesId = null
    if (processType === 'renderer') {
      senderId = winId
      rSeriesId = puid.uid()
    } else {
      senderId = 'main'
      seriesId = puid.uid()
    }
    let communication = new Communication({ seriesId, rSeriesId, receiverId, senderId, initCb: resolve })
    communicationsMap[communication.communicateId] = communication
    let sender = getSender(processType, receiverId)
    if (sender) sender.send('communicate', { communicateKey, seriesId, receiverId, senderId, operation: 'init' })
    else console.log('sender is null')
  })
}
let ipc = processType === 'renderer' ? ipcRenderer : ipcMain
const initConnectors = []
ipc.on('communicate', (e, data) => {
  if (data.communicateKey !== communicateKey) return
  if (processType === 'main' && data.seriesId === null) data.seriesId = puid.uid()
  let communicateId = `${data.senderId}-${data.seriesId}-${data.receiverId}`
  if (data.operation === 'end') {
    if (communicateId in communicationsMap) {
      communicationsMap[communicateId].end()
      delete communicationsMap[communicateId]
    }
    return
  }
  if (isReceiver(data)) {
    let communication
    switch (data.operation) {
      case 'init':
        communication = new Communication(data)
        communicationsMap[communicateId] = communication
        if (!subscribed) initConnectors.push({ sender: e.sender, data })
        if (processType === 'main' && data.seriesId === null) {
          data.seriesId = puid.uid()
          e.sender.send('communicate', { operation: 'updateSeriesId', senderId: data.senderId, rSeriesId: data.rSeriesId, seriesId: data.seriesId })
        }
        break
      case 'initDone':
        communication = communicationsMap[communicateId]
        if (communication.seriesId === null) communication.seriesId = data.seriesId
        if (communication) communication.initDone()
        break
      case 'message':
        communication = communicationsMap[communicateId]
        if (communication) communication.messageCb(data.message)
        else {
          communication = communicationsMap[`${data.receiverId}-${data.seriesId}-${data.senderId}`]
          if (communication) communication.messageCb(data.message)
        }
        break
      case 'updateSeriesId':
        communicateId = `${data.senderId}-${data.rSeriesId}-${data.receiverId}`
        communication = communicationsMap[communicateId]
        communication.seriesId = data.seriesId
        delete communicationsMap[communicateId]
        communication.communicateId = `${data.senderId}-${data.seriesId}-${data.receiverId}`
        communicationsMap[communication.communicateId] = communication
        break
    }
  } else {
    let sender = getSender(processType, data.receiverId)
    if (sender) sender.send('communicate', data)
    else console.log('sender is null')
    if (data.operation === 'initDone') {
      let communication = communicationsMap[communicateId]
      if (communication) communication.initDone()
    }
  }
})

function isReceiver(data) {
  switch (data.operation) {
    case 'init':
      if (processType === 'main' && data.receiverId === 'main') return true
      if (processType === 'renderer' && data.receiverId === winId) return true
      return false
    case 'initDone':
      if (processType === 'main' && data.senderId === 'main') return true
      if (processType === 'renderer' && data.senderId === winId) return true
      return false
    case 'message':
      if (processType === 'main' && (data.receiverId === 'main' || data.senderId === 'main')) return true
      if (processType === 'renderer' && (data.receiverId === winId || data.senderId === winId)) return true
      return false
    case 'updateSeriesId':
      return true
  }
}

// 监听通讯，调用Callback,参数为通讯对象
function subscribeCommunications(cb) {
  if (!validateProcess(processType)) return
  if (subscribed) return
  ipc.on('communicate', (e, data) => {
    if (data.communicateKey !== communicateKey) return
    if (data.operation === 'init') {
      try {
        let communication = new Communication(data)
        communicationsMap[communication.communicateId] = communication
        cb(communication)
        data.operation = 'initDone'
        e.sender.send('communicate', data)
      } catch (e) {
        console.log('got e', e)
      }
    }
    if (initConnectors.length > 0) {
      for (let connector of initConnectors) {
        let communication = new Communication(data)
        communicationsMap[communication.communicateId] = communication
        cb(communication)
        connector.data.operation = 'initDone'
        connector.sender.send('communicate', connector.data)
      }
    }
  })
  subscribed = true
}
export { initCommunication, subscribeCommunications }

/*
sample use window id or 'main' if connecting to main process
initCommunication(windowId).then(connection => {
        console.log('got connection', connection)
        connection.send('message from renderer')
        connection.onMessage(message => {
          console.log('got message', message)
        })
      })
      subscribeCommunications(connection => {
      connection.onMessage(message => {
        console.log('got message', message)
        connection.send('message from main')
      })
    })
*/
