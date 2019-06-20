let clickEvents
let eventsJson='[]'
function monitorClick(){
    document.addEventListener('click',e=>{
        clickEvents.push({e})
    })
}

// 导出事件
// function 
let userEvents=[]
let curTime=null
function startRecord(){
    curTime=Date.now()
    document.addEventListener('click',recordClick)
    document.addEventListener('input',recordInput)
}
function stopRecord(){
    document.removeEventListener('click',recordClick)
    document.removeEventListener('input',recordInput)
    let retJson=JSON.stringify(userEvents)
    userEvents=[]
    eventsJson= retJson
    return retJson
}
let lastEl
function recordClick(e){
    let tsDiff=Date.now()-curTime
    curTime=Date.now()
    userEvents.push({tsDiff,type:'click',x:e.clientX,y:e.clientY})
}
function recordInput(e){
    let tsDiff=Date.now()-curTime
    curTime=Date.now()
    userEvents.push({tsDiff,type:'input',data:e.data})
}
function execute(json){
    lastEl=null
    let events=JSON.parse(json)
    walkEvent(events,0)
}
function replay(){
    execute(eventsJson)
}
function walkEvent(events,i){
    let event=events[i]
    setTimeout(()=>{
        switch(event.type){
            case 'click':
                executeClick(event)
                break
            case 'input':
                executeInput(event)
                break
        }
        if(i+1<events.length) walkEvent(events,i+1)
    },event.tsDiff)
}
function executeClick(clickEvent){
    lastEl=document.elementFromPoint(clickEvent.x,clickEvent.y)
    lastEl.click()
}
function executeInput(inputEvent){
    lastEl.value=lastEl.value?lastEl.value+inputEvent.data:inputEvent.data
    lastEl.dispatchEvent(new Event('input'));
}
