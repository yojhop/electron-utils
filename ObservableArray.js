class ObservableArray{
    constructor(){
        this.array=[]
        this.observers=[]
        this.onces=[]
    }
    push(val){
        this.array.push(val)
        this.notify({type:'push',index:this.array.length-1,value:val})
    }
    pop(){
        let val=this.array.pop()
        this.notify({type:'pop',index:this.array.length,value:val})
    }
    sort(func){
        this.array.sort(func)
        this.notify({type:'sort'})
    }
    reverse(){
        this.array.reverse()
        this.notify({type:'reverse'})
    }
    shift(){
        let val=this.array.shift()
        this.notify({type:'shift',value:val})
    }
    splice(index,removeCnt,value){
        this.array.splice(index,removeCnt,value)
        this.notify({type:'splice',index,removeCnt,value})
    }
    set(index,val){
        this.array[index]=val
        this.notify({type:"set",value:val,index})
    }
    notify(msg){
        for(let observer of this.observers){
            if(observer.types.includes('all')||observer.types.includes(msg.type)){
                observer.cb(msg)
            }
        }
        let toRemove=[]
        let len=this.onces.length
        while(len--){
            let once=this.onces[len]
            if(once.types.includes('all')||once.types.includes(msg.type)){
                once.cb(msg)
                toRemove.push(len)
            }
        }
        for(let i of toRemove){
            this.onces.splice(i,1)
        }
    }
    get(index){
        return this.array[index]
    }
    observe(types,cb){
        if(typeof types.length==='undefined'){
            this.observers.push({types:[types],cb})
        }
        else{
            this.observers.push({types:[types],cb})
        }
    }
    once(types,cb){
        if(typeof types.length==='undefined'){
            this.onces.push({types:[types],cb})
        }
        else{
            this.onces.push({types:[types],cb})
        }
    }
}