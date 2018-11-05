import {object2KVs,KVs2Object} from './ObjectKVConverter'

function createFromTemplate(obj,template){
    let tmpKVs=object2KVs(template).reverse()
    let objKVs=object2KVs(obj).reverse()
    for(let oKV of objKVs){
        let kv=findPath(oKV.path,tmpKVs)
        if(kv){
            console.log('found')
            kv.value=oKV.value
        }
        else{
            tmpKVs.push(oKV)
		}
    }
    return KVs2Object(tmpKVs)
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