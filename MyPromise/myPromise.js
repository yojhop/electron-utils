class Promise{
    constructor(fn){
        this.resolve=this.resolve.bind(this)
        this.reject=this.reject.bind(this)
        this.resolveParams=null
        this.rejectParams=null
        this.rejected=false
        this.resolved=false
        this.pendingFns=[]
        this.status='notStart'
        try{
            fn(this.resolve,this.reject)
        }
        catch(e){
            this.reject(e)
        }
        
    }
    resolve(...params){
        this.resolveParams=params
        // 设置状态为已处理
        this.status='resolved'
        this.processPendings()
    }
    reject(...params){
        // 设置状态为拒绝
        this.rejectParams=params
        this.status='rejected'
        this.processPendings()
    }
    processPendings(){
        let pendingFn=this.pendingFns.shift()
        
        while(pendingFn){
            if(pendingFn.type==='then'){
                if(this.status==='resolved'){
                    this.tryCall(pendingFn.fn,this.resolveParams)
                }
                else if(this.status==='hasError') this.tryCall(pendingFn.fn)
            }
            else if(pendingFn.type==='catch'){
                if(this.status==='rejected'){
                    this.status='hasError'
                    this.tryCall(pendingFn.fn,this.rejectParams)
                    
                }
            }
            pendingFn=this.pendingFns.shift()
        }
    }
    catch(fn){
        // 如果状态为拒绝，调用函数并且设置状态为有错误,如果状态为未开始，则加入到待处理列表
        if(this.status==='rejected'){
            this.status='hasError'
            this.tryCall(fn,this.rejectParams)
            
        }
        else if(this.status==='notStart') this.pendingFns.push({fn,type:'catch'})
        return this
    }
    // 函数调用，如果捕捉到错误，将状态设置为拒绝,设置错误
    tryCall(fn,params){
        try{
            if(params!==undefined) fn(...params)
            else fn()
        }
        catch(e){
            this.reject(e)
        }
    }
    
    then(fn){
        // 如果状态为有错误，则用空参数调用函数，如果状态为已处理，则用处理返回调用函数,如果还没处理则加入到待处理列表
        if(this.status==='resolved') this.tryCall(fn,this.resolveParams)
        else if(this.status==='hasError') this.tryCall(fn)
        else if(this.status==='notStart'){
            this.pendingFns.push({fn,type:'then'})
        }
        return this
    }
}
module.exports= {Promise}