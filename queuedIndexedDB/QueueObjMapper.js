import { ObjectsMapper } from './objectsMapper'
class QueueProcessor {
  constructor() {
    this.reqs = []
    this.lock = false
  }
  tryProcess() {
    if (this.reqs.length > 0) {
      if (!this.lock) {
        const req = this.reqs.shift()
        this.lock = true
        req.handler(req.data)
      }
    }
  }
  endProcess() {
    this.lock = false
    this.tryProcess()
  }
  pushReq(data, handler) {
    this.reqs.push({ handler, data })
    this.tryProcess()
  }
}
class QueueObjMapper {
  constructor(dbName) {
    this.mapper = new ObjectsMapper(dbName)
    this.queue = new QueueProcessor()
    this.initValues()
  }
  getData(tableName, comparators, cb, errCb) {
    if (this.mapper.isInited()) {
      console.log('has inited')
      this.mapper.getData({ tableName, comparators, cb, errCb })
    } else {
      console.log('hasnt inited')
      const handler = (data) => {
        this.mapper[data.method](data)
      }
      const endCb = () => {
        this.queue.endProcess()
      }
      this.queue.pushReq({ tableName, comparators, cb, errCb, endCb, method: 'getData' }, handler)
    }
  }
  replaceData(tableName, rmMatch, datas, cb, errCb) {
    // this.initValues()
    const handler = (data) => {
      this.mapper[data.method](data)
    }
    const endCb = () => {
      this.queue.endProcess()
    }
    this.queue.pushReq({ tableName, rmMatch, datas, cb, errCb, endCb, method: 'replaceData' }, handler)
  }
  replaceDatas(tableName, key, datas, cb, errCb) {
    // this.initValues()
    const handler = (data) => {
      this.mapper[data.method](data)
    }
    const endCb = () => {
      this.queue.endProcess()
    }
    this.queue.pushReq({ tableName, key, datas, cb, errCb, endCb, method: 'replaceDatas' }, handler)
  }
  resetDatas(tableName, datas, cb, errCb) {
    // this.initValues()
    const handler = (data) => {
      this.mapper[data.method](data)
    }
    const endCb = () => {
      this.queue.endProcess()
    }
    this.queue.pushReq({ tableName, datas, cb, errCb, endCb, method: 'resetDatas' }, handler)
  }
  initValues() {
    const handler = (data) => {
      this.mapper[data.method](data)
    }
    const endCb = () => {
      this.queue.endProcess()
    }
    this.queue.pushReq({ method: 'initValues', endCb }, handler)
  }
}
export { QueueObjMapper }
