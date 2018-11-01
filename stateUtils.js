function registerAll(context,links){
    let linksLen=links.length
    const allNames=[]
    while(linksLen--){
        let link=links[linksLen]
        // let prevStates=link.prevStates
        addStates(link.prevStates,allNames)
        let events=link.events
        let eventLen=events.length
        while(eventLen--){
            let triggerName=events[eventLen].trigger.name
            if(!allNames.includes(triggerName)){
                allNames.push(triggerName)
            }
            addStates(events[eventLen].nextStates,allNames)
        }
    }
    let valsMap={}
    allVals.forEach(name=>{
        Object.defineProperty(context,name,{
            get:()=>{
                return valsMap[name]
            },
            set:(newV)=>{
                let oldV=valsMap[name]
                valsMap[name]=newV
                stateChanged(newV,oldV,name,links)
            }
        })
    })
}
function stateChanged(newV,oldV,name,links){

}
function addStates(states,vals){
    let statesLen=states.length
    while(statesLen--){
        let name=states[statesLen].name
        if(!vals.includes(name)){
            vals.push(name)
        }
    }
}
class StateLink{
    constructor(prevStates,events){
        this.prevStates=prevStates
        this.events=events
    }
}
class Event{
    constructor(trigger,nextStates){
        this.trigger=trigger
        this.nextStates=nextStates
    }
}
class State{
    constructor(name,value){
        this.name=name
        this.value=value
    }
}
class Trigger{
    constructor(stateName,func,output){
        this.stateName=stateName
        this.func=func
        this.output=output
    }
    trigger(val){
        return this.func(val)===output
    }
}