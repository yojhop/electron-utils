function search({arr,fn,val}){
    if(arr.length===0){
        return -1
    }
    if(arr.length===1){
        return fn(arr[0])===0?0:-1
    }
    let middle=Math.floor(arr.length/2)
    let middleRet
    if(fn){
        middleRet=fn(arr[middle])
    }
    else if(val!==undefined){
        if(val>arr[middle]){
            middleRet=1
        }
        else if(val<arr[middle]){
            middleRet=-1
        }
        else middleRet=0
    }
    else{
        throw new Error('fn and val all undefined')
    }
    let subRet=null
    switch(middleRet){
        case 0:
            return middle
        case 1:
            if(middle===0) return -1
            subRet= search(arr.slice(0,middle),fn)
            if(subRet===null||subRet<0) return -1
            return subRet
        case -1:
            if(middle===arr.length-1) return -1
            subRet= search(arr.slice(middle+1),fn)
            if(subRet===null||subRet<0) return -1
            return middle+1+subRet
    }
}
function defaultCompareFn(val){
    return new Function('a',`if(a<${val}){return -1};
                             if(a>${val}){return 1};
                             return 0`)
}

var arr=[1,2,3,4,5]
var fn=defaultCompareFn(3)
search(arr,fn)