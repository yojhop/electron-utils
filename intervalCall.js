
import { puid } from './uuid'
let cacheCalls = []
let callsMap = {}
function intervalCall(cb, interval, ...args) {
  let id = puid.uid()
  for (let i = 0; i < cacheCalls.length; i++) {
    let callItem = cacheCalls[i]
    if (callItem.cb === cb) {
      callItem.valid = false
      try {
        clearTimeout(callItem.timeoutId)
      } catch (e) {}
      let newCallItem = { cb, interval, args, valid: true }
      callsMap[id] = newCallItem
      cacheCalls.splice(i, 1, newCallItem)
      let curTime = new Date().getTime()
      if (curTime - callItem.lastCall >= interval) {
        startCallLoop(newCallItem)
      } else {
        setTimeout(() => {
          startCallLoop(newCallItem)
        }, interval - curTime + callItem.lastCall)
      }
      return id
    }
  }
  let callItem = { cb, interval, args, valid: true }
  callsMap[id] = callItem
  cacheCalls.push(callItem)
  startCallLoop(callItem)
  return id
}
function cancelInterval(id) {
  if (id in callsMap) {
    callsMap[id].valid = false
  }
}
function startCallLoop(callItem) {
  let ret = callItem.cb(...callItem.args)
  if (Object.prototype.toString.call(ret) === '[object Promise]') {
    ret.catch(() => {}).then(() => {
      if (!callItem.valid) {
        return
      }
      callItem.lastCall = new Date().getTime()
      callItem.timeoutId = setTimeout(() => {
        startCallLoop(callItem)
      }, callItem.interval)
    })
  } else {
    callItem.lastCall = new Date().getTime()
    callItem.timeoutId = setTimeout(() => {
      startCallLoop(callItem)
    }, callItem.interval)
  }
}
export { intervalCall, cancelInterval }
