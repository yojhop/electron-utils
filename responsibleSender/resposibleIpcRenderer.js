
import { ipcRenderer } from 'electron'
import { guid } from '../../renderer/utils/uuid'
// 渲染进程ipc通讯，区别是在接收到某个数据会发回acknowledge
const INTERVAL = 2000

// 发送信息到主进程，默认2s内没有收到acknowledge(uuid仍在waiting队列)则重新发送该消息，
// 发送时带上uuid，并且将uuid加入到waiting队列
// 随机字符串，用户区分专属于普通的通讯
function sendMessage(msgType, data) {
  // console.log('getting guid')
  let uuid = guid.uuid()
  // console.log('sending', `message-${randomKey}`, { type: msgType, data, uuid })
  ipcRenderer.send(`message-${randomKey}`, { type: msgType, data, uuid })
  let intervalId = setInterval(() => {
    let index = waitingQueue.indexOf(uuid)
    if (index >= 0) ipcRenderer.send(`message-${randomKey}`, { type: msgType, data, uuid })
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
let globalVals = { globalMonitor: false, lastSeriesId: -1 }
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
  if (!globalVals.globalMonitor && ipcRenderer) {
    ipcRenderer.on(`acknowledge-${randomKey}`, (event, data) => {
      // console.log('got acknowledge for', data)
      let index = waitingQueue.indexOf(data.uuid)
      if (index >= 0) waitingQueue.splice(index, 1)
    })
    globalVals.globalMonitor = true
    ipcRenderer.on(`message-${randomKey}`, (e, data) => {
      let seriesId = Number(data.uuid.split('-')[1])
      if (seriesId > globalVals.lastSeriesId) {
        globalVals.lastSeriesId = seriesId
        let eventType = data.type
        if (eventType in eventsMap) {
          for (let cb of eventsMap[eventType]) cb(e, data.data)
        }
      }
      ipcRenderer.send(`acknowledge-${randomKey}`, { uuid: data.uuid })
    })
  }
}

export { sendMessage, setRandomKey, onMessage, removeEvent }
