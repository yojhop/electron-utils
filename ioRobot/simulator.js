let robot=require('robotjs')
let robotKeyCodeMap=require('./config')
let keycodeCmdMap={}
for(let cmd in robotKeyCodeMap){
    keycodeCmdMap[robotKeyCodeMap[cmd]]=cmd
}
function performKeyUp(keyUpEvent){
    let {altKey,shiftKey,ctrlKey,keyCode} = keyUpEvent
    let cmd=keycodeCmdMap[keyCode]
    if(cmd){
        let modified=[]
        if(altKey) modified.push('alt')
        if(shiftKey) modified.push('shift')
        if(ctrlKey) modified.push('control')
        if(modified.length>0){
            robot.keyTap(cmd,modified)
        }
        else{
            robot.keyTap(cmd)
        }
    }
}
// perform mousemove
// get x and y and perform
function performMouseMove(moveEvent){
    let {x,y} = moveEvent
    robot.moveMouse(x,y)
}


// perform dragmouse
// get x and y and perform
function performMouseDrag(dragEvent){
    let {x,y} = moveEvent
    robot.dragMouse(x,y)
}
// perform mouseToggle
// set button and is double and perform
function performMouseToggle(toggleEvent){
    let {button,type} = toggleEvent
    let buttonType=button===1?'left':button===2?'right':'middle'
    switch(type){
        case 'mousedown':
            robot.mouseToggle('down',buttonType)
            break
        case 'mouseup':
            robot.mouseToggle('up',buttonType)
            break
    }
}
// mousedrag performMouseDrag
// mousedown mouseup performMouseToggle
// mousemove performMouseMove
// keyup performKeyUp
function perform(event){
    switch(event.type){
        case 'keyup':
            performKeyUp(event)
            break
        case 'mousedrag':
            performMouseDrag(event)
            break
        case 'mouseup':
        case 'mousedown':
            performMouseToggle(event)
            break
        case 'mousemove':
            performMouseMove(event)
            break
    }
}
module.exports={perform}