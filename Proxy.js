class ObjectProxy{
    constructor(obj,changeCB){
        this.notifyList=[]
        this.timeoutId=null
        let f=this.processNotification
        let proto
        this.__proto__ = new Proxy(obj, {
            get: (target, name)=> {
                if (!(name in target)) {
                    return undefined;
                }
                return target[name];
            },
            set: (target, name, value)=> {
                console.log('setting invoked',name,value)
                this.notifyList.push({oldValue:target[name],name,newValue:value})
                
                if(!(name in target)){
                    console.log('defining',proto,name)
                    Object.defineProperty(proto,name,{set:(val)=>{
                        console.log('setting',name,val)
                    }})
                }
                target[name] = value;
                clearTimeout(this.timeoutId)
                this.timeoutId=setTimeout(()=>{this.processNotification()},0)
                return true
            }
        })
        // let self=this.__proto__
        this.__proto__.processNotification=f
        this.__proto__.changeCB=changeCB
        proto=this.__proto__
    }
    processNotification(){
        let valuesMap={}
        for(let notifyItem of this.notifyList){
            if(!(notifyItem.name in valuesMap)){
                valuesMap[notifyItem.name]={newValue:notifyItem.newValue,oldValue:notifyItem.oldValue}
            }
            else{
                valuesMap[notifyItem.name].newValue=notifyItem.newValue
            }
        }
        for(let name in valuesMap){
            if(valuesMap[name].oldValue!==valuesMap[name].newValue){
                this.changeCB&&this.changeCB()
                break
            }
        }
        this.notifyList=[]
    }
}
// test()
let p=new ObjectProxy([],()=>{console.log('changed')})
    p.push(1)
    delete p[0]