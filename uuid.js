import { remote } from 'electron'
export function bestEffortUUID() {
  let ts = new Date().getTime()
  let hexDigits = '0123456789abcdef'
  let uuid = ts + '-'
  for (let i = 0; i < 8; i++) {
    uuid += hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  return uuid
}
let guid = null
if (remote) {
  guid = (function() {
    let obj = {}
    obj.cnt = -1
    let winId = remote.getCurrentWindow().id
    obj.uuid = () => {
      obj.cnt++
      return winId + '-' + obj.cnt
    }
    return obj
  })()
}
export { guid }
