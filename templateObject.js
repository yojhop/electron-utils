import {object2KVs,KVs2Object} from './ObjectKVConverter'
const objTypeOf=Object.prototype.toString
function createFromTemplate(obj,template){
    let tmpKVs=object2KVs(template).reverse()
    let objKVs=object2KVs(obj).reverse()
    for(let tKV of tmpKVs){
        let kv=findPath(tKV.path,objKVs)
        if(kv){
            if(tKV.value !== null && typeof tKV.value !== 'undefined' && objTypeOf.call(kv.value)!==objTypeOf.call(tKV.value)){
                kv.value=tKV.value
            }
        }
        else{
            objKVs.push(tKV)
        }
    }
    return KVs2Object(objKVs)
}
function findPath(path,kvs){
    for(let kv of kvs){
        if(kv.path===path){
            return kv
        }
    }
    return null
}
export {createFromTemplate}