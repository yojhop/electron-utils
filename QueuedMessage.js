class QueuedMessage {
  constructor({ handler, addFunc, timeout = 0 }) {
    try {
      this.addFunc = addFunc
      this.queue = []
      this.timeout = timeout
      this.handler = handler
      this.timeoutId = null
      this.handleQueue = this.handleQueue.bind(this)
      this.lastHandled = null
      this.nextSet = null
      this.timeoutId = null
    } catch (err) {
      console.log(err)
    }
  }
  handleQueue() {
    if (this.queue.length > 0) {
      // console.log(new Date().getTime(), 'handled')
      this.lastHandled = this.getTimestamp()
      this.handler(this.queue)
      this.queue = []
    }
  }
  clear() {
    this.queue = []
  }
  getTimestamp() {
    return new Date().getTime()
  }
  addMessage(msg) {
    this.addFunc ? this.addFunc(this.queue, msg) : this.queue.push(msg)
    this.tryProcess()
  }
  addMessages(msgs) {
    if (this.addFunc) {
      for (let msg of msgs) this.addFunc(this.queue, msg)
    } else this.queue = this.queue.concat(msgs)
    this.tryProcess()
  }
  // 如果当前更新id不为null，则不做处理

  // 如果当前更新id为空，如果当前时间与上次更新时间差大于timeout或者上次更新时间为Null，则直接处理队列，并且更新上次更新时间
  // 如果更新id为空，并且当前时间与上次更新时间差小于timeout，则设置延迟处理队列，更新上次更新时间，处理完成后设置更新id为null,
  // 用延迟返回设置更新id
  tryProcess() {
    if (this.timeoutId !== null) return
    let curTs = this.getTimestamp()
    if (this.lastHandled === null || curTs - this.lastHandled > this.timeout) {
      this.handleQueue()
    } else {
      this.timeoutId = setTimeout(() => {
        this.handleQueue()
        this.timeoutId = null
      }, this.timeout - (curTs - this.lastHandled))
    }
  }
  updateTimeout(newTimeout) {
    this.timeout = newTimeout
  }
  getTimeout() {
    return this.timeout
  }
}

export { QueuedMessage }

