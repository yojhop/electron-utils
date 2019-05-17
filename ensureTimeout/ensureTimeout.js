// 将每个timeout加入列表，存入id和cutoff和cb

// 对于每个即将触发的事件，判断其是否还在list，否则忽略


// 如果list里面有cutoff小于当前时间的事件，则进行触发然后删除事件
const timeoutList=[]
let oldSetTimeout=window.setTimeout
window.setTimeout=(fn,timeout)=>{
    let id=oldSetTimeout(()=>{
        for(let i=0;i<timeoutList.length;i++){
            let item=timeoutList[i]
            if(item.id===id){
                item.cb()
                timeoutList.splice(i,1)
                break
            }
        }
        processCutoffs()
    },timeout)

    timeoutList.push({cb:fn,cutoff:timeout+Date.now(),id})
}
function processCutoffs(){
    let nowTs=Date.now()
    let toRemove=[]
    let len=timeoutList.length
    while(len--){
        let item=timeoutList[len]
        if(item.cutoff<nowTs){
            toRemove.push(len)
            item.cb()
        }
    }
    for(let i of toRemove){
        timeoutList.splice(i,1)
    }
}