class ObjectProxy{
    constructor(obj,changeCB){
        // this.notifyList=[]
        let notifyList=[]
        let timeoutId=null
        let processFunc=()=>{
            let valuesMap={}
            for(let notifyItem of notifyList){
                if(!(notifyItem.name in valuesMap)){
                    valuesMap[notifyItem.name]={newValue:notifyItem.newValue,oldValue:notifyItem.oldValue}
                }
                else{
                    valuesMap[notifyItem.name].newValue=notifyItem.newValue
                }
            }
            for(let name in valuesMap){
                if(valuesMap[name].oldValue!==valuesMap[name].newValue){
                    changeCB&&changeCB()
                    break
                }
            }
            notifyList.length=0
        }
        let self=this
        this.__proto__ = new Proxy(obj, {
            get: (target, name)=> {
                if (!(name in target)) {
                    return undefined;
                }
                return target[name];
            },
            set: (target, name, value)=> {
                if(self[name]&&self[name]===value){
                    return true
                }
                // console.log('setting invoked')
                notifyList.push({oldValue:target[name],name,newValue:value})
                clearTimeout(timeoutId)
                timeoutId=setTimeout(()=>{processFunc()},0)
                target[name] = value;

                this.__proto__[name]=value
                return true
            }
        })
        // self.started=false
        // self.processNotification=processNotification
        // self.started=true
    }
}