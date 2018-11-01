import {simpleEquals} from './ObjectUtils'
import {deepCopy} from './copy'
class StateMachine{
    constructor(context,links){
        this.links=links
        this.allNames=[]
        this.context=context
        this.valsMap=deepCopy(context)
        links.forEach(link=>{
            this.addStates(link.prevStates)
            link.events.forEach(event=>{
                this.addStates(event.nextStates)
            })
        })
        this.allNames.forEach(name=>{
            Object.defineProperty(this.context,name,{
                get:()=>{
                    return this.valsMap[name]
                },
                set:(newV)=>{
                    let oldV=this.valsMap[name]
                    this.valsMap[name]=newV
                    this.stateChanged(oldV,name)
                }
            })
        })
    }
    stateChanged(oldV,name){
        let cyMap=deepCopy(this.valsMap)
        for(let link of this.links){
            cyMap[name]=oldV
            if(this.statesMatch(link.prevStates,cyMap)){
                cyMap[name]=this.valsMap[name]
                for(let event of link.events){
                    if(this.statesMatch(event.nextStates,cyMap)){
                        event.cb&&event.cb(cyMap)
                    }
                }
            }
        }
    }
    addStates(states){
        for(let name in states){
            if(!this.allNames.includes(name)){
                this.allNames.push(name)
            }
        }
    }
    statesMatch(states,map){
        for(let name in states){
            if(!simpleEquals(states[name],map[name])){
                return false
            }
        }
        return true
    }
}
class StateLink{
    constructor(prevStates,events){
        this.prevStates=prevStates
        this.events=events
    }
}
class Event{
    constructor(cb,nextStates){
        this.cb=cb
        this.nextStates=nextStates
    }
}
export {StateMachine,StateLink,Event}