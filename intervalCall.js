let cacheCalls = []
function intervalCall(cb, interval, ...args) {
  for (let callItem of cacheCalls) {
    // invoked previously
    if (callItem.cb === cb) {
      callItem.interval = interval
      try {
        clearTimeout(callItem.timeoutId)
        console.log('clear Timeout', callItem.timeoutId)
      } catch (e) {}
      let curTime = new Date().getTime()
      if (curTime - callItem.lastCall >= interval) {
        startCallLoop(callItem)
      } else {
        setTimeout(() => {
          startCallLoop(callItem)
        }, interval - curTime + callItem.lastCall)
      }
      return
    }
  }
  let callItem = { cb, interval, args }
  cacheCalls.push(callItem)
  startCallLoop(callItem)
}
function startCallLoop(callItem) {
  let ret = callItem.cb(...callItem.args)
  if (Object.prototype.toString.call(ret) === '[object Promise]') {
    ret.catch(() => {}).then(() => {
      callItem.lastCall = new Date().getTime()
      callItem.timeoutId = setTimeout(() => {
        startCallLoop(callItem)
      }, callItem.interval)
      console.log('new Timeout', callItem.timeoutId)
    })
  } else {
    callItem.lastCall = new Date().getTime()
    callItem.timeoutId = setTimeout(() => {
      startCallLoop(callItem)
    }, callItem.interval)
    console.log('new Timeout', callItem.timeoutId)
  }
}