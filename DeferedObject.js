let id=0
let invokes={}
function deffered(context,name,initFunc){
    let curId=id
    invokes[curId]=false
    let value
    let property
    if(Object.prototype.toString.call(initFunc)==='[object Promise]'){
        property={get : async function(){
            if(invokes[curId]){
                return value
            }
            value=await initFunc
            invokes[curId]=true
            Object.defineProperty(context,name,{get:function(){
                return value
            },configurable:true})
            return value
        },configurable: true}
    }
    else{
        property={get : function(){
            if(invokes[curId]){
                return value
            }
            value=initFunc()
            invokes[curId]=true
            return value
            },configurable:true
        }
    }
    Object.defineProperty(context,name,property)
    id++
    requestIdleCallback(async function(){
        console.log('in idle')
        if(!invokes[curId]){
            if(Object.prototype.toString.call(initFunc)==='[object Promise]'){
                console.log('in promise idle callback')
                value=await initFunc
                invokes[curId]=true
            }
            else{
                console.log('in function idle callback')
                value=initFunc()
                invokes[curId]=true
            }
            Object.defineProperty(context,name,{get:function(){
                return value
            },configurable:true})
        }
    })
}