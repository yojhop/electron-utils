let setIds=[]
let intervalObj={id:0}
function setInterval(cb,interval){
    let nextTs=Date.now()+interval
    let id=intervalObj.id++
    setIds.push(id)
    checkInterval(cb,id,nextTs,interval)
    return id
}
function checkInterval(cb,id,nextTs,interval){
    if(!setIds.includes(id)) return
    requestAnimationFrame(()=>{
        if(!setIds.includes(id)) return
        let nowTs=Date.now()
        if(nowTs>=nextTs){
            nextTs=nextTs+interval
            cb()
            checkInterval(cb,id,nextTs,interval)
        }
        else checkInterval(cb,id,nextTs,interval)
    })
}
function clearInterval(id){
    let ind=setIds.indexOf(id)
    if(ind>=0) setIds.splice(ind,1)
}