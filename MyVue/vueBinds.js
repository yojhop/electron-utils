class VueBinder{
    constructor(vue,cb){
        this.vue=vue
        this.callbacksMap={}
        let p=this.proxy(vue)
        cb&&Cb(p)
    }
    // 对于vue中的任意一个字段，启用proxy

    proxy(obj){
        return new Proxy(obj, {
            get: (target, name)=> {
                console.log('getting',name)
                if (!(name in target)) {
                    return undefined;
                }
                return target[name];
            },
            set: (target, name, value)=> {
                let oldVal=target[name]
                target[name]=value
                if(!simpleEquals(value,oldVal)) this.trigger(name,value)
            }
        })
    }
    trigger(name,val){
        if(name in this.callbacksMap){
            for(let cb of this.callbacksMap[name]) cb(name,val)
        }
    }
    register(name,cb){
        if(!(name in this.callbacksMap)) this.callbacksMap[name]=[]
        this.callbacksMap[name].push(cb)
    }
}