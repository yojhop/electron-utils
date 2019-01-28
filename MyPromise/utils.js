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
module.exports={promiseAll}