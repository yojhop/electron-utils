const toString=Object.prototype.toString

function simpleEquals(value1,value2){
    let type1=toString.call(value1)
    let type2=toString.call(value2)
    if(type1!==type2) return false
    switch(type1){
        case '[object Function]':
            if(!functionEquals(value1,value2)) return false
            break
        case '[object Object]':
            if(!objectEquals(value1,value2)) return false
            break
        case '[object Array]':
            if(!arrayEquals(value1,value2)) return false
            break
        default:
            if(value1!==value2) return false
    }
    return true
}
function functionEquals(f1,f2){
    return f1.toString()===f2.toString()
}
function objectEquals(obj1,obj2){
    let keys1=Object.keys(obj1)
    let keys2=Object.keys(obj2)
    if(keys1.length!==keys2.length){
        return false
    }
    for(let key of keys1){
        if(!keys2.includes(key)){
            return false
        }
        if(!simpleEquals(obj1[key],obj2[key])) return false
    }
    return true
}
function arrayEquals(arr1,arr2){
    if(arr1.length!==arr2.length){
        return false
    }
    let len=arr1.length
    while(len--){
        if(!simpleEquals(arr1[len],arr2[len])) return false
    }
    return true
}