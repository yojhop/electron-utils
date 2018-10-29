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
