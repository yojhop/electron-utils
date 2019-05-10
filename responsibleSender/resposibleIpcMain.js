
import { ipcMain } from 'electron'
import { guid } from '../../renderer/utils/uuid'
// 主进程ipc通讯，区别是在接收到某个数据会发回acknowledge
const INTERVAL = 2000

// 发送信息到主进程，默认2s内没有收到acknowledge(uuid仍在waiting队列)则重新发送该消息，
// 发送时带上uuid，并且将uuid加入到waiting队列
// 随机字符串，用户区分专属于普通的通讯
function sendMessage(webContents, msgType, data) {
  let uuid = guid.uuid()
  webContents.send(`message-${randomKey}`, { type: msgType, data: data, uuid })
  let intervalId = setInterval(() => {
    let index = waitingQueue.indexOf(uuid)
    if (index >= 0) webContents.send(`message-${randomKey}`, { type: msgType, data: data, uuid })
    else clearInterval(intervalId)
  }, INTERVAL)
  waitingQueue.push(uuid)
}
// 设置randomkey
let randomKey = null
function setRandomKey(key) {
  randomKey = key
  tryMonitor()
}
let globalVals = { globalMonitor: false }
let seriesMap = {}
let eventsMap = {}
// 添加监听函数

// 将根据type将事件加入监听map
function onMessage(type, event) {
  if (!(type in eventsMap)) eventsMap[type] = []
  if (!(eventsMap[type].includes(event))) eventsMap[type].push(event)
}
// 删除监听函数从对应的type中将事件删除
function removeEvent(type, event) {
  if (type in eventsMap) {
    let index = eventsMap[type].indexOf(event)
    if (index >= 0) eventsMap[type].splice(index, 1)
  }
}
let waitingQueue = []
// 对于acknowledge-randomkey，从waiting队列中删除对应uuid

// 对于message-randomkey，
// 如果seriesId<=上一个seriesId,不做处理
// 否则进行事件触发
// 查看其type对应的事件，触发事件，并且发回acknowledge-randomkey,更新主进程对应的seriesId
function tryMonitor() {
  if (!globalVals.globalMonitor && ipcMain) {
    ipcMain.on(`acknowledge-${randomKey}`, (event, data) => {
      let uuid = data.uuid
      let index = waitingQueue.indexOf(uuid)
      if (index >= 0) waitingQueue.splice(index, 1)
    })
    globalVals.globalMonitor = true
    ipcMain.on(`message-${randomKey}`, (e, data) => {
      // console.log('got message', data)
      let [winId, seriesId] = data.uuid.split('-')
      seriesId = Number(seriesId)
      if (seriesMap[winId] === undefined || seriesId > seriesMap[winId]) {
        seriesMap[winId] = seriesId
        let eventType = data.type
        // console.log('invoking callbacks')
        if (eventType in eventsMap) {
          for (let cb of eventsMap[eventType]) cb(e, data.data)
        }
      }
      e.sender.send(`acknowledge-${randomKey}`, { uuid: data.uuid })
    })
  }
}

export { sendMessage, setRandomKey, onMessage, removeEvent }
