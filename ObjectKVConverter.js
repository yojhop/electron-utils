const hasOwn=Object.prototype.hasOwnProperty
const toString=Object.prototype.toString
function object2KVs(obj){
    if(toString.call(obj)!=='[object Object]'){
        throw new Error("obj param is not object");  
    }
    return walkObject(obj)
}
function KVs2Object(kvs){
    let obj={}
    for(let path of kvs){
        if(hasOwn.call(path,'path')&&hasOwn.call(path,'value')){
            let parts=path.path.split('.')
            walkPath(obj,parts,path.value)
        }
    }
    return obj
}
function walkPath(obj,parts,value){
    let cur=obj
    for(let i=0;i<parts.length;i++){
        const index=indexKey(parts[i])
        let ind
        index>=0?ind=index:ind=parts[i]
        if(!cur[ind]){
            let leftParts=parts.slice(i+1)
            if(leftParts.length>0){
                let nextPart=leftParts[0]
                if(indexKey(nextPart)>=0){
                    cur[ind]=[]
                }
                else{
                    cur[ind]={}
                }
            }
            else{
                cur[ind]=value
            }
        }
        cur=cur[ind]
    }
}
function indexKey(key){
    if(typeof key!=='string'||key.length<3){
        return -1
    }
    let hasIndexInd=key.startsWith('[')&&key.endsWith(']')
    if(hasIndexInd){
        let ind=+key.substring(1,key.length-1)
        if(ind===ind) return ind
    }
    return -1
}
function walkObject(obj){
    let kvs=[]
    if(toString.call(obj)==='[object Object]'){
         for(let key of Object.keys(obj)){
            for(let path of walkObject(obj[key])){
                if(path.path){
                    kvs.push({path:`${key}.${path.path}`,value:path.value})
                }
                else{
                    kvs.push({path:key,value:path.value})
                }
            }
         }
    }else if(toString.call(obj)==='[object Array]'){
        for(let i=0;i<obj.length;i++){
            for(let path of walkObject(obj[i])){
                if(path.path){
                    kvs.push({path:`[${i}].${path.path}`,value:path.value})
                }
                else{
                    kvs.push({path:`[${i}]`,value:path.value})
                }
            }
        }
    } else{
        kvs.push({path:null,value:obj})
    }
    return kvs
}
export {object2KVs,KVs2Object}