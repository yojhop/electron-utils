const {Promise}=require('./myPromise')
function promiseAll(promises){
    return new Promise((resolve,reject)=>{
        let cnt=0
        const resolveParams=[]
        for(let i=0;i<promises.length;i++){
            let promise=promises[i]
            promise.then(res=>{
                cnt++
                resolveParams[i]=res
                if(cnt===promises.length){
                    resolve(resolveParams)
                }
            }).catch(err=>{
                reject(err)
            })
        }
    })
}
// 将函数转成可以有返回的promise

// 将reject 和resolve传递给异步函数，异步函数执行完成后，根据reject或者resolve回调函数

function promisify(fn,...params){
    return new Promise((resolve,reject)=>{
        if(Object.prototype.toString.call(fn)==='[object AsyncFunction]'){
            let caller=async function(){
                try{
                    let t=await fn(...params)
                    resolve(t)
                }
                catch(e){
                    reject(e)
                }
            }
            caller()
        }
        else if(Object.prototype.toString.call(fn)==='[object Function]'){
            try{
                let t=fn(...params)
                resolve(t)
            }
            catch(e){
                reject(e)
            }
        }
        else throw new Error('not supported type, can only be function or aync function')
    })
}

module.exports={promiseAll,promisify}