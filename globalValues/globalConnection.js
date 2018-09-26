import axios from 'axios'
import { update } from './globalValuesMain'
let intervalId
let urls = []
let intervalsMap = {}
export function addUrl(url, timeout) {
  if (!urls.includes(url)) {
    urls.push({ url: url, timeout: timeout })
  }
}
export function startGlobalConnections(timeout) {
  // if (intervalId) {
  //   return
  // }
  // intervalId = setInterval(() => {
  //   for (let url of urls) {
  //     fetchData(url.url)
  //   }
  // }, timeout)
  for (let url of urls) {
    if (url.url in intervalsMap) {
      continue
    }
    intervalsMap[url.url] = setInterval(() => {
      fetchData(url.url)
    }, url.timeout)
  }
}
function fetchData(url) {
  let prefix = url.substring(url.lastIndexOf('/') + 1)
  axios.get(url).then(res => {
    let map = {}
    walkObj(res.data, map, prefix)
    for (let key in map) {
      update(key, map[key])
    }
  }).catch(err => {
    console.log('connecting error', err)
  })
}
function walkObj(obj, map, prefix = '') {
  if (typeof obj === 'object') {
    if (!obj.length) {
      if (prefix !== '') {
        prefix += '.'
      }
      for (let key in obj) {
        let newPrefix = `${prefix}${key}`
        map[newPrefix] = obj[key]
        walkObj(obj[key], map, newPrefix)
      }
    } else {
      for (let i in obj) {
        let newPrefix = `${prefix}[${i}]`
        map[newPrefix] = obj[i]
        walkObj(obj[i], map, newPrefix)
      }
    }
  }
}
export function stopGlobalConnections() {
  if (intervalId) {
    try {
      clearInterval(intervalId)
      intervalId = null
    } catch (err) {}
  }
}
