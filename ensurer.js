import {getUniqObject} from './uniqClass'
let ctxResolves={}
function untilInit({ctx,name,initChecker}){
    initChecker=initChecker?initChecker:(v)=>{
        return typeof v!=='undefined'&&v!==null
    }
    return new Promise((resolve,reject)=>{
        if(initChecker(ctx[name])){
            resolve()
        }
        else{
            let uniqObj=getUniqObject({ctx,name})
            if(!ctxResolves[uniqObj]){
                ctxResolves[uniqObj]=[resolve]
                let cur=ctx[name]
                // console.log('defining',ctx,name)
                Object.defineProperty(ctx,name,{
                    set:(val)=>{
                        if(initChecker(val)){
                            if(ctxResolves[uniqObj]){
                                for(let r of ctxResolves[uniqObj]){
                                    r()
                                }
                                ctxResolves[uniqObj]=[]
                            }
                        }
                        cur=val
                    },
                    get:()=>{
                        return cur
                    },configurable:true
                })
            }
            else{
                ctxResolves[uniqObj].push(resolve)
            }
        }
    })
}
function ensureSuccess(fn,tryInterval,until){
    return new Promise((resolve,reject)=>{
        if(typeof until==='number'&&new Date().getTime()>until){
            reject('timeout')
            return
        }
        fn().then(res=>{
            resolve(res)
        }).catch(()=>{
            setTimeout(()=>{
                ensureSuccess(fn,tryInterval,until).then(res=>{
                    resolve(res)
                }).catch(err=>{
                    reject(err)
                })
            })
        })
    })
}