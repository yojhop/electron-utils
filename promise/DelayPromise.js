import {Promise} from 'bluebird-lst'
class DelayPromise{
    constructor(fn){
        this.fn=fn
        this.promise=null
        this.started=false
    }
    start(){
        if(this.started) return this
        this.started=true
        this.promise=new Promise(this.fn)
        return this
    }
    then(fn){
        return this.promise.then(res=>{
            fn(res)
        })
    }
    catch(fn){
        return this.promise.catch(err=>{
            fn(err)
        })
    }
}