// let id=0
// const timers={}
function stepTimer(util,cb,minDiff=10000,level=10){
    let nowTS=new Date().getTime()
    if(nowTS>=util){
        cb()
    }
    else{
        let diff=(util-nowTS)/level
        diff=diff<minDiff?minDiff:diff
        setTimeout(()=>{stepTimer(util,cb,minDiff,level)},diff)
    }
}
function interval(func,timeout,cb,errCb){
    const toString=Object.prototype.toString
    if(toString.call(func)==='[object Promise]'){
        func.then(res=>{
            cb&&cb(res)
        }).catch(err=>{
            errCb&&errCb(err)
        }).then(()=>{
            setTimeout(()=>{
                interval(func,timeout,cb)
            },timeout)
        })
    }
    else if(toString.call(func)==='[object Function]'){
        cb&&cb(func())
        setTimeout(()=>{
            interval(func,timeout,cb)
        },timeout)
    }
}