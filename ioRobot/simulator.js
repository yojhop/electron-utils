let robot=require('kbm-robot')
let kbmRobotKeyMap=require('./config')
let keycodeCmdMap={}
robot.startJar()
for(let cmd in kbmRobotKeyMap){
    keycodeCmdMap[kbmRobotKeyMap[cmd]]=cmd
}
function performKeyUp(keyUpEvent){
    let {altKey,shiftKey,ctrlKey,keyCode} = keyUpEvent
    let cmd=keycodeCmdMap[keyCode]
    if(cmd){
        let keys=[]
        if(altKey) keys.push('ALT')
        if(shiftKey) keys.push('SHIFT')
        if(ctrlKey) keys.push('CTRL')
        keys.push(cmd)
        for(let key of keys){
            robot.press(key)
        }
        for(let key of keys){
            robot.release(key)
        }
    }
}
// perform mousemove
// get x and y and perform
function performMouseMove(moveEvent){
    let {x,y} = moveEvent
    robot.mouseMove(x,y)
}


// perform dragmouse
// get x and y and perform
// function performMouseDrag(dragEvent){
//     let {x,y} = moveEvent
//     robot.dragMouse(x,y)
// }
// perform mouseToggle
// set button and is double and perform
function performMouseToggle(toggleEvent){
    let {button,type} = toggleEvent
    switch(type){
        case 'mousedown':
            robot.mousePress(button+'')
            break
        case 'mouseup':
            robot.mouseRelease(button+'')
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
        // case 'mousedrag':
        //     performMouseDrag(event)
        //     break
        case 'mouseup':
        case 'mousedown':
            performMouseToggle(event)
            break
        case 'mousemove':
            performMouseMove(event)
            break
    }
}
function startAll(){
    robot.go()
}
module.exports={perform,startAll}