import {object2KVs,KVs2Object} from './ObjectKVConverter'

function addPath(obj,path,value){
    let objKVs=object2KVs(obj)
    let found=false
    for(let kv of objKVs){
        if(path===kv.path){
            found=true
            break
        }
    }
    if(!found){
        objKVs.push({path,value})
    }
    return KVs2Object(objKVs)
}
function deletePath(obj,path){
    let objKVs=object2KVs(obj)
    let len=objKVs.length
    while(len--){
        if(path===objKVs[len].path){
            objKVs.splice(len,1)
            break
        }
    }
    console.log(objKVs)
    return KVs2Object(objKVs)
}
function executeCommand(command){
    let [func,...params]=command.split(' ')
    debugger
    const args=[]
    for(let param of params){
        args.push(JSON.parse(param))
    }
    console.log(this[func],args)
}
function movePath(obj,oriPath,newPath,defaultVal=null){
    let val=defaultVal
    let objKVs=object2KVs(obj)
    let len=objKVs.length
    while(len--){
        if(oriPath===objKVs[len].path){
            val=objKVs[len].value
            objKVs.splice(len,1)
            break
        }
    }
    objKVs.push({path:newPath,value:val})
    return KVs2Object(objKVs)
}