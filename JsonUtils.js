function getPath(jsonStr,path){
    if(typeof path==='undefined'||path===null||path===''){
        return JSON.parse(jsonStr)
    }
    const paths=path.split('.')
    return findPath(jsonStr,paths)
}

function findPath(jsonStr,paths){
    console.log('finding path for',jsonStr,paths)
    if(paths.length===0){
        return JSON.parse(jsonStr)
    }
    jsonStr=jsonStr.trim()
    if(jsonStr.startsWith('{')&&jsonStr.endsWith('}')){
        jsonStr=jsonStr.substring(1,jsonStr.length-1)
    }
    let KV=nextKeyValue(jsonStr,0)
    while(KV){
        // console.log(KV)
        if(KV.key===paths[0]){
            let leftPaths=paths.slice(1)
            return findPath(KV.value,leftPaths)
        }
        KV=nextKeyValue(jsonStr,KV.end+1,true)
    }
    return null
}
function nextKeyValue(str,startIndex,skipComma=false){
    if(str===''){
        return null
    }
    let keyItem=nextItem(str,startIndex,skipComma)
    if(keyItem===null){
        return null
    }
    let valueItem=nextItem(str,keyItem.end+1)
    if(valueItem===null){
        return null
    }
    // console.log('get item',valueItem)
    return {key:keyItem.item.substring(1,keyItem.item.length-1),value:valueItem.item,end:valueItem.end}
}

function nextItem(str,startIndex,skipComma=false){
    // console.log(str,startIndex)
    if(str===''){
        return null
    }
    if(startIndex>=str.length){
        return null
    }
    let startSymbol=null
    let start=startIndex
    while(startIndex<str.length){
        let ch=str.charAt(startIndex)
        switch(ch){
            case '"':
                if(startSymbol===null){
                    startSymbol={type:'string',start:startIndex}
                }
                else if(startSymbol.type==='string'){
                    return {item:str.substring(startSymbol.start,startIndex+1),end:startIndex}
                }
                break
            case ':':
                if(startSymbol===null){
                    start=startIndex+1
                }
                break
            case '{':
                if(startSymbol===null){
                    startSymbol={type:'object',start:startIndex,cnt:1}
                }
                else if(startSymbol.type==='object'){
                    startSymbol.cnt++
                }
                break
            case '}':
                if(startSymbol&&startSymbol.type==='object'){
                    if(startSymbol.cnt===1){
                    // console.log('returning',{item:str.substring(startSymbol.start,startIndex+1),end:startIndex})
                        return {item:str.substring(startSymbol.start,startIndex+1),end:startIndex}
                    }
                    else{
                        startSymbol.cnt--
                    }
                }
                break
            case '[':
                if(startSymbol===null){
                    startSymbol={type:'array',start:startIndex,cnt:1}
                }
                else if(startSymbol.type==='array'){
                    startSymbol.cnt++
                }
                break
            case ']':
                if(startSymbol&&startSymbol.type==='array'){
                    if(startSymbol.cnt===1){
                    // console.log('returning',{item:str.substring(startSymbol.start,startIndex+1),end:startIndex})
                        return {item:str.substring(startSymbol.start,startIndex+1),end:startIndex}
                    }
                    else{
                        startSymbol.cnt--
                    }
                }
                break
            case ',':
                if(skipComma){
                    skipComma=false
                    start=startIndex+1
                }
                else if(startSymbol===null){
                    return {item:str.substring(start,startIndex+1).trim(),end:startIndex}
                }
                break
        }
        startIndex++
    }
    // console.log('')
    if(startSymbol===null){
        return {item:str.substring(start,str.length).trim(),end:str.length-1}
    }
    return null
}