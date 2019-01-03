/*
 * @Author: Amos
 * @Date: 2018-12-24 13:59:51
 * @LastEditors: Amos
 * @LastEditTime: 2018-12-24 18:30:15
 * @Description: file content
 */
let kvMap = {}
let observeMap = {}
let getValMap = {}
function observePageValue(name, cb) {
  return new Promise((resolve, reject) => {
    if (name in kvMap) {
      resolve(kvMap[name])
    } else {
      if (!(name in observeMap)) {
        observeMap[name] = []
      }
      observeMap[name].push({ resolve, cb })
    }
  })
}

function setPageValue(name, value) {
  if (name in observeMap) {
    if (!(name in kvMap)) {
      observeMap[name].forEach(item => item.resolve(value))
    } else {
      if (kvMap[name] !== value) observeMap[name].forEach(item => item.cb && item.cb(value))
    }
  }
  if (name in getValMap) {
    getValMap[name].forEach(item => item.resolve(value))
    getValMap[name] = []
  }
  kvMap[name] = value
}
function getPageValue(name) {
  return new Promise((resolve, reject) => {
    if (name in kvMap) {
      resolve(kvMap[name])
    } else {
      if (!(name in getValMap)) {
        getValMap[name] = []
      }
      getValMap[name].push({ resolve })
    }
  })
}
module.exports= {observePageValue,setPageValue,getPageValue}