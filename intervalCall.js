let cacheCalls = []
function intervalCall(cb, interval, ...args) {
  for (let i = 0; i < cacheCalls.length; i++) {
    let callItem = cacheCalls[i]
    if (callItem.cb === cb) {
      callItem.interval=interval
      callItem.queue.updateInterval(interval)
      callItem.args=args
      // callItem.queue.updateDoneCb()
      // callItem.valid = false
      // try {
      //   clearTimeout(callItem.timeoutId)
      // } catch (e) {}
      // let newCallItem = { cb, interval, args, valid: true }
      // cacheCalls.splice(i, 1, newCallItem)
      // let curTime = new Date().getTime()
      // if (curTime - callItem.lastCall >= interval) {
      //   startCallLoop(newCallItem)
      // } else {
      //   setTimeout(() => {
      //     startCallLoop(newCallItem)
      //   }, interval - curTime + callItem.lastCall)
      // }
      // startLoopAdd(callItem)
      callItem.queue.addCall(cb)
      return
    }
  }
  // console.log('new invoke')
  let queue=new IntervalQueue(interval,()=>{
    console.log('setting tiemout',callItem.interval)
    setTimeout(()=>{
      callItem.queue.addCall(cb)
    },callItem.interval)
  })
  let callItem = { cb, interval, args, valid: true, queue }
  cacheCalls.push(callItem)
  // startCallLoop(callItem)
  callItem.queue.addCall(cb)
  // startLoopAdd(callItem)
}
class IntervalQueue {
  constructor(interval,doneCb){
    this.queue=[]
    this.interval=interval
    this.lastCall=null
    this.executing=false
    this.scheduled=false
    this.doneCb=doneCb
  }
  updateInterval(interval){
    this.interval=interval
  }
  // updateDoneCb(){
  //   this.doneCb=doneCb
  // }
  addCall(fn){
    if(this.lastCall===null){
      this.execute(fn,()=>{
        this.lastCall=new Date().getTime()
      })
    }
    else{
      let curTime=new Date().getTime()
      if(this.executing||this.scheduled){
        this.queue.push(fn)
      }
      else if(curTime-this.lastCall<this.interval){
        this.queue.push(fn)
        // setTimeout()
        this.scheduleCall(this.interval-curTime+this.lastCall)
      }
      else{
        this.execute(fn,()=>{
          this.lastCall=new Date().getTime()
        })
      }
    }
  }
  scheduleCall(interval){
    interval=interval||this.interval
    if(this.queue.length>0){
      setTimeout(()=>{
        let fn=this.queue[this.queue.length-1]
        this.execute(fn,()=>{
          this.lastCall=new Date().getTime()
        })
        this.queue=[]
      },interval)
      this.scheduled=true
    }
  }
  execute(fn,cb){
    // debugger
    this.executing=true
    let ret=fn()
    if(Object.prototype.toString.call(ret)==='[object Promise]'){
      ret.catch(err=>{
        console.log('get error',err)
      }).then(()=>{
        this.executing=false
        this.scheduled=false
        console.log('execute done')
        cb&&cb()
        this.doneCb&&this.doneCb()
        this.scheduleCall()
      })
    }
    else{
      cb&&cb()
      this.doneCb&&this.doneCb()
    }
  }
}
let fn=()=>{return new Promise((resolve,reject)=>{setTimeout(()=>{console.log(new Date());resolve(1)},2000)})}
intervalCall(fn, 1000)
// export { intervalCall }
