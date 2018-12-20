export function tryAll(promises) {
  const succs = []
  const fails = []
  return new Promise((resolve, reject) => {
    const walkFn = (i) => {
      if (i < promises.length) {
        promises[i].then(res => {
          succs.push(res)
          walkFn(++i)
        }).catch(err => {
          fails.push(err)
          walkFn(++i)
        })
      } else {
        resolve({ succs, fails })
      }
    }
    walkFn(0)
  })
}
export function tryPromise({fn,maxTry,interval}){
  return new Promise((resolve,reject)=>{
      fn().then(res=>{
        resolve(res)
      }).catch(err=>{
        if(typeof maxTry==='number'){
          maxTry--
          if(maxTry>0){
            if(interval) setTimeout(()=>{
              tryPromise({fn,maxTry,interval}).then(res=>{
                resolve(res)
              }).catch(err=>{
                reject(err)
              })
            },interval)
          }
          else{
            reject(err)
          }
        }
        else{
          reject(err)
        }
      })
  })
}
export function retryableAll(promises,maxTry){
    const succs = []
  const fails = []
  return new Promise((resolve, reject) => {
    const walkFn = (i,tryTime) => {
      if (i < promises.length) {
        promises[i].then(res => {
          succs.push(res)
          walkFn(++i,0)
        }).catch(err => {
          tryTime+=1
          if(tryTime<maxTry){
              console.log(i,'promise failed, will try',tryTime)
              walkFn(i,tryTime)
          }
          else{
            console.log(i,'promise failed after',maxTry,'try')
            fails.push(err)
            walkFn(++i,0)
          }
        })
      } else {
        resolve({ succs, fails })
      }
    }
    walkFn(0,0)
  })
}