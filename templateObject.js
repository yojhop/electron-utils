import {object2KVs,KVs2Object} from './ObjectKVConverter'

function createFromTemplate(obj,template){
    let tmpKVs=object2KVs(template)
    let objKVs=object2KVs(obj)
    for(let kv of tmpKVs){
        let val=findPath(kv.path,objKVs)
        if(val){
            kv.value=val
        }
    }
    return KVs2Object(tmpKVs)
}
function findPath(path,kvs){
    for(let kv of kvs){
        if(kv.path===path){
            return kv.value
        }
    }
    return null
}
export {create}