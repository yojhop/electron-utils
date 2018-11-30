import {simpleEquals} from './ObjectUtils'
const kvsMap={}
const onceObservers=[]
const observers=[]
function update(key,value){
    for(let observer of observers){
        needCallback(observer,key,value)
    }
    let len=onceObservers.length
    while(len--){
        let observer=onceObservers[len]
        if(needCallback(observer,key,value)) onceObservers.splice(len,1)
    }
    kvsMap[key]=value
}
function needCallback(observer,key,value){
    if(observer.checker&&observer.checker(value)){
        if(observer.checker(value)){
        observer.callback(value)
        return true
        }
    }
    else if(!simpleEquals(kvsMap[key],value)){
        observer.callback(value)
        return true
    }
    return false
}
function observe({checker,key,callback}){
    observers.push({checker,key,callback})
    if(checker&&(key in kvsMap)){
        if(checker(kvsMap[key])){
            callback(kvsMap[key])
        }
    }
}
function once({checker,key,callback}){
    if(checker&&(key in kvsMap)){
        if(checker(kvsMap[key])){
            callback(kvsMap[key])
            return
        }
    }
    onceObservers.push({checker,key,callback})
}