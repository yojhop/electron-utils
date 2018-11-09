function safeInvoke({name,checker,obj,cb}){
    if(Object.prototype.toString.call(obj)!=='[object Object]'){
        throw new Error('obj should be object')
    }
    if(checker){
        if(checker(obj,name)){
            cb&&cb(obj[name])
        }
    }
    else{
        cb&&cb(obj[name])
    }
}
function invokeCheck({checker,obj,cb}){
    if(checker){
        if(Object.prototype.toString.call(checker)==='[object Function]'){
            if(checker(obj)){
                cb&&cb(obj)
                return
            }
        }
        else if(Object.prototype.toString.call(checker)==='[object Promise]'){
            checker(obj).then(res=>{
                if(res){cb&&cb(obj)}
            })
        }
        else{
            throw new Error('checker should be promise or function')
        }
    }
    else{
        cb&&cb(obj)
    }
}