function queueProcess(queue,quitOnFail){
    return walkPromises(queue,0,quitOnFail,[])
}
function walkPromises(queue,i,quitOnFail,results){
    return new Promise((resolve,reject)=>{
        if(i>=queue.length){
            resolve(results)
            return
        }
        let promise=queue[i]
        promise.start().then(res=>{
            results.push(res)
            i++
            walkPromises(queue,i,quitOnFail,results).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        }).catch(err=>{
            results.push(err)
            if(!quitOnFail){
                i++
                walkPromises(queue,i,quitOnFail,results).then(res=>{
                    resolve(res)
                }).catch(err=>{
                    reject(err)
                })
            }
            else{
                reject(results)
            }
        })
    })
}
export {queueProcess}