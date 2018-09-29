import Dexie from 'dexie'

// TO AMOS: 你自己这里手动调整一下是不是debug环境，没必要再另一个文件夹再开一个文件
function isDebug() {
  return false
}
class ObjectsMapper {
  constructor(dbName) {
    this.dbName = dbName
    this.db = new Dexie(dbName)
    this.tablesDB = new Dexie(`${dbName}Tables`)
    this.tablesDB.version(1).stores({ dbTables: 'name,columns' })
    this.tables = {}
    this.tablesConfig = {}
    this.hasInited = false
    // this.initValues()
  }
  initValues(data) {
    let { endCb } = data
    this.tablesDB.dbTables.toArray().then(res => {
      this.db = new Dexie(this.dbName)
      let toStore = {}
      if (isDebug()) console.log('res is', res)
      res.forEach(t => {
        let columns = t.columns ? t.columns : ''
        toStore[t.name] = columns
        this.tablesConfig[t.name] = columns
      })
      if (isDebug()) console.log('storing', toStore)
      this.db.version(1).stores(toStore)
      const datasQueries = []
      res.forEach(t => {
        datasQueries.push(new Promise((resolve, reject) => {
          this.db[t.name].toArray(res => {
            this.tables[t.name] = res
            resolve(0)
          }).catch(err => {
            console.log(`db has inconsistence for table ${t.name}`, err)
            resolve(1)
          })
        }))
      })
      Promise.all(datasQueries).then(rets => {
        this.hasInited = true
        console.log('tables after init', this.tables)
        endCb && endCb()
      }).catch(err => {
        console.log('execute query promises error', err)
        this.hasInited = true
        endCb && endCb()
      })
    }).catch(err => {
      this.hasInited = true
      console.log('init values error', err)
      endCb && endCb()
    })
  }
  isInited() {
    return this.hasInited
  }
  resetDatas(data) {
    let { tableName, datas, cb, errCb, endCb } = data
    this.tables[tableName] = datas
    if (isDebug()) console.log('processing', tableName, datas)
    const { newCb, newErrCb } = this.wrapCbs(cb, errCb, endCb)
    this.pushToIndexedDB(tableName, newCb, newErrCb)
  }
  fillDatas(rows, oldObj) {
    if (rows.length > 0) {
      const oldKeys = Object.keys(oldObj)
      const newKeys = Object.keys(rows[0])
      for (let oldKey of oldKeys) {
        if (!newKeys.includes(oldKey)) {
          for (let row of rows) {
            row[oldKey] = null
          }
        }
      }
    }
  }
  replaceDatas(data) {
    let { tableName, key, datas, cb, errCb, endCb } = data
    const { newCb, newErrCb } = this.wrapCbs(cb, errCb, endCb)
    if (Object.prototype.toString.call(datas) === '[object Object]') {
      datas = [datas]
    }
    if (typeof key !== 'string') {
      newErrCb && newErrCb({ code: 'error', message: 'key should be string' })
      return
    }
    if (!this.tables[tableName]) {
      this.tables[tableName] = []
    }
    let newKeys = datas.map(item => {
      return item[key]
    })
    let oldDatas = this.tables[tableName].filter(item => {
      if (newKeys.includes(item[key])) {
        return false
      }
      return true
    })
    this.tables[tableName] = oldDatas.concat(datas)
    this.pushToIndexedDB(tableName, newCb, newErrCb)
  }
  replaceData(data) {
    let { tableName, rmMatch, datas, cb, errCb, endCb } = data
    const { newCb, newErrCb } = this.wrapCbs(cb, errCb, endCb)
    if (Object.prototype.toString.call(datas) === '[object Object]') {
      datas = [datas]
    }
    if (typeof rmMatch === 'undefined' || rmMatch === null) {
      this.tables[tableName] = datas
    } else if (Object.prototype.toString.call(rmMatch) === '[object Object]') {
      const newRows = datas
      if (this.tables[tableName]) {
        if (this.tables[tableName].length > 0) {
          this.fillDatas(newRows, this.tables[tableName][0])
          for (let row of this.tables[tableName]) {
            if (row[rmMatch.name] !== rmMatch.value) {
              newRows.push(row)
            }
          }
        }
      }
      this.tables[tableName] = newRows
      console.log('tables after ', data, this.tables)
    } else {
      newErrCb && newErrCb({ code: 'error', message: 'rmMatch should be null or object' })
      return
    }
    this.pushToIndexedDB(tableName, newCb, newErrCb)
  }
  pushToIndexedDB(tableName, cb, errCb) {
    let inconsistent = this.merge()
    if (inconsistent) {
      if (isDebug()) console.log('db has incontence, need to reset')
      this.resetDB(() => {
        if (isDebug()) console.log('reset db for inconsistent succeed')
        cb && cb()
      }, err => {
        console.log('reset db for inconsistent failed', err)
        errCb && errCb()
      })
    } else {
      this.db[tableName].clear().then(() => {
        this.db[tableName].bulkPut(this.tables[tableName]).then(() => {
          cb && cb(this.tables[tableName])
        }).catch(err => {
          errCb && errCb({ message: `cannot put datas for ${tableName}`, error: err })
        })
      }).catch(err => {
        errCb && errCb({ message: `cannot clear datas for ${tableName}`, error: err })
      })
    }
  }
  resetDB(cb, errCb) {
    let saveFn = () => {
      const toPut = []
      if (isDebug()) console.log('tablesConfig', this.tablesConfig)
      Object.keys(this.tablesConfig).forEach(tableName => {
        toPut.push({ name: tableName, columns: this.tablesConfig[tableName] })
      })
      this.tablesDB.dbTables.bulkPut(toPut).then(res => {
        if (isDebug()) console.log('stores', this.tablesConfig)
        this.db.version(1).stores(this.tablesConfig)
        let putCmds = []
        if (isDebug()) console.log('tables', this.tables)
        Object.keys(this.tables).forEach(key => {
          putCmds.push(new Promise((resolve, reject) => {
            if (isDebug()) console.log('putting datas', key, this.tables[key])
            this.db[key].bulkPut(this.tables[key]).then(res => {
              if (isDebug()) console.log('reset datas for table', key, 'succeed', this.tables[key])
              resolve({ result: 'success', message: `reset datas for table ${key} succeed` })
            }).catch(err => {
              console.log(`cannot put datas for ${key} when rebuild db`, err)
              resolve({ result: 'failed', message: `reset datas for table ${key} failed`, error: err })
            })
          }))
        })
        Promise.all(putCmds).then(res => {
          const succs = []
          const fails = []
          res.forEach(ret => {
            ret.result === 'success' ? succs.push(ret) : fails.push(ret)
          })
          if (succs.length) {
            cb && cb(succs)
          }
          if (fails.length) {
            errCb && errCb(fails)
          }
        }).catch(err => {
          console.log('cannot execute promises', putCmds)
          errCb && errCb({ message: 'cannot execute promises for putting datas', error: err })
        })
      }).catch(err => {
        console.log('cannot put datas to tablesDB', err)
        errCb && errCb()
      })
    }
    this.db.delete().then(() => {
      if (isDebug()) console.log('data deleted')
      this.db = new Dexie(this.dbName)
      this.tablesDB.dbTables.clear().then(() => {
        saveFn(cb)
      }).catch(err => {
        console.log('clear dbTables failed', err)
        saveFn(cb)
      })
    }).catch(err => {
      console.log('delete db failed', err)
      errCb && errCb(err)
    })
  }
  wrapCbs(cb, errCb, endCb) {
    let newCb = cb
    let newErrCb = errCb
    if (endCb) {
      newCb = (res) => {
        cb && cb(res)
        endCb()
      }
      newErrCb = (err) => {
        errCb && errCb(err)
        endCb()
      }
    }
    // console.log('return cbs', { newCb, newErrCb })
    return { newCb, newErrCb }
  }
  getData(data) {
    let { tableName, comparators, cb, errCb, endCb } = data
    // console.log('cbs', cb, errCb, endCb)
    let cbs = this.wrapCbs(cb, errCb, endCb)
    // console.log('cbs', cbs)
    const { newCb } = cbs

    if (typeof comparators === 'undefined' || comparators === null) {
      if (!this.tables[tableName]) {
        if (isDebug()) console.log('cannot find table', tableName)
        let emptySet = []
        newCb(emptySet)
        return
      }
      // this.db[tableName].toArray().then(res => {
      //   console.log('callbacks of getData', tableName, res)
      //   newCb(res)
      // }).catch(err => {
      //   newErrCb(err)
      // })
      newCb(this.tables[tableName])
    } else if (Object.prototype.toString.call(comparators) === '[object Object]') {
      if (!this.tables[tableName]) {
        let emptySet = []
        console.log('setting_check cannot find table', tableName)
        newCb(emptySet)
      } else {
        let res = []
        for (let data of this.tables[tableName]) {
          if (data[comparators.name] === comparators.value) res.push(data)
        }
        newCb(res)
        // console.log('setting_check comparators', comparators)
        // this.db[tableName].where(comparators.name)[comparators.op](comparators.value).toArray().then(res => {
        // newCb(res)
        // }).catch(err => {
        //   newErrCb(err)
        // })
      }
    }
  }
  merge() {
    let inconsistent = false
    if (isDebug()) console.log('merging', this.tables, this.tablesConfig)
    let configKeys = Object.keys(this.tablesConfig)
    let tableNames = Object.keys(this.tables)
    const fn = (key) => {
      if (this.tables[key].length > 0) {
        let obj = this.tables[key][0]
        if (!this.hasSameKeys(this.tablesConfig[key], obj)) {
          this.tablesConfig[key] = Object.keys(obj).join(',')
          inconsistent = true
        }
      }
    }
    configKeys.forEach(key => {
      if (!tableNames.includes(key)) {
        inconsistent = true
        this.tables[key] = []
      } else {
        fn(key)
      }
    })
    tableNames.forEach(name => {
      if (!configKeys.includes(name)) {
        if (this.tables[name].length > 0) {
          inconsistent = true
          this.tablesConfig[name] = Object.keys(this.tables[name][0]).join(',')
        }
      } else {
        fn(name)
      }
    })
    if (isDebug()) console.log('after merged', this.tables, this.tablesConfig)
    return inconsistent
  }
  hasSameKeys(keyStr, obj) {
    if (typeof keyStr === 'undefined' || keyStr === null) {
      return false
    }
    let keys = keyStr.split(',').sort()
    let objKeys = Object.keys(obj).sort()
    if (objKeys.length !== keys.length) {
      return false
    }
    let len = objKeys.length
    while (len--) {
      if (objKeys[len] !== keys[len]) {
        return false
      }
    }
    return true
  }
}
export { ObjectsMapper }
