let uniqList=(function() {
    return []
})()
class UniqObject{
    constructor(data){
        this.data=data
    }
}
function getUniqObject(data){
    for(let uniqObj of uniqList){
        let uniqData=uniqObj.data
        if(isSameData(uniqData,data)){
            return uniqObj
        }
    }
    let uniqObj=new UniqObject(data)
    uniqList.push(uniqObj)
    return uniqObj
}
function isSameData(data1,data2){
    let keys1=Object.keys(data1)
    let keys2=Object.keys(data2)
    if(keys1.length!==keys2.length){
        return false
    }
    for(let key1 of keys1){
        if(!keys2.includes(key1)){
            return false
        }
    }
    for(let key2 of keys2){
        if(!keys1.includes(key2)){
            return false
        }
    }
    for(let key of keys1){
        if(data1[key]!==data2[key]){
            return false
        }
    }
    return true
}
export {getUniqObject}