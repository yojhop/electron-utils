function queueProcess(queue){
    walkPromises(queue,0)
}
function walkPromises(queue,i){
    if(i>=queue.length) return
    let promise=queue[i]
    promise.start().catch(()=>{}).then(res=>{
        i++
        walkPromises(queue,i)
    })
}
export {queueProcess}