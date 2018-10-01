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
      } catch (err) {
        console.log(err)
      }
    }
    //   startProcess() {
    //     this.queue = []
    //     if (this.timeoutId) {
    //       clearTimeout(this.timeoutId)
    //     }
    //     this.handleQueue()
    //   }
    handleQueue() {
      // console.log('handle queue', this.queue)
      if (this.queue.length > 0) {
        this.lastHandled = this.getTimestamp()
        this.handler(this.queue)
        this.queue = []
      }
      // setTimeout(this.handleQueue, this.timeout)
    }
    getTimestamp() {
      return new Date().getTime()
    }
    addMessage(msg) {
      // console.log('adding message', msg)
      this.addFunc ? this.addFunc(this.queue, msg) : this.queue.push(msg)
      if (this.lastHandled === null) {
        this.handleQueue()
      } else {
        if (this.lastHandled + this.timeout !== this.nextSet) {
          setTimeout(this.handleQueue, this.timeout - this.getTimestamp() + this.lastHandled)
          this.nextSet = this.lastHandled + this.timeout
        }
      }
    }
    updateTimeout(newTimeout) {
      this.timeout = newTimeout
    }
    getTimeout() {
      return this.timeout
    }
  }
  