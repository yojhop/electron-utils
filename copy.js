import {object2KVs,KVs2Object} from './ObjectKVConverter'
function deepCopy(obj){
    return KVs2Object(object2KVs(obj))
}
export {deepCopy}