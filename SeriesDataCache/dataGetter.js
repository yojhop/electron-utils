const fs=require('fs')
function getFileDatas(filePath,since,until){
    if(fs.existsSync(filePath)){
        let content=fs.readFileSync(filePath,'utf8')
        let lines=content.split('\n')
        if(lines.length>1){
            let blocks=JSON.parse(lines[0])
            // console.log('getting datas',blocks,since,until,lines)
            return getDatas(blocks,since,until,lines)
        }
    }
    return [{since,until,cached:false}]
}
// 根据ts数值大小进行排序，对于block,since标记为begin,until标记为end,lineStart标记为lineStart,lineEnd标记为lineEnd，记录lineNumber
// 对于since标记为since,对于until标记为until,
// 从左到右检查各个值
// 当遇到标记为since时开始处理(started=true)
// 对于每个点，检查该点和后一个点，记录当前点和下一点，
// 如果当前点为since，下一个点为begin，标记cached为false
// 如果当前点为since，下一点为end，标记cached为true，从前一个点对应lineNumber开始直到下一个点对应的lineNumber，
// 把记录ts大于等于since的数据加入到datas中,
// 如果下一点为until,标记cached为false
// 如果当前点为begin,则将当前点对应lineNumber开始到下一点对应的lineNumber的数据加入到datas，标记cached为true

// 如果当前点为end,标记cached为false

// 如果当前点为until，结束处理
function getFileBlocks(filePath){
    if(fs.existsSync(filePath)){
        let content=fs.readFileSync(filePath,'utf8')
        let lines=content.split('\n')
        let fileBlocks=[]
        if(lines.length>1){
            let blockInfos=JSON.parse(lines[0])
            for(let info of blockInfos){
                let datas=[]
                let lineStart=info.lineStart
                while(lineStart<=info.lineEnd){
                    datas.push(lineToData(lines[lineStart]))
                    lineStart++
                }
                fileBlocks.push({since:info.since,until:info.until,datas})
            }
            return fileBlocks
        }
    }
    return []
}
function getDatas(blocks,since,until,fileLines){ 
    let points=[]
    points.push({marker:'since',ts:since})
    points.push({marker:'until',ts:until})
    for(let block of blocks){
        points.push({marker:'begin',ts:block.since,lineNum:block.lineStart})
        points.push({marker:'end',ts:block.until,lineNum:block.lineEnd})
    }
    points.sort((a,b)=>{
        if(a.ts>b.ts){
            return 1
        }
        else if(a.ts<b.ts){
            return -1
        }
        else{
            if(a.marker==='since'){
                return -1
            }
            else if(a.marker==='until'){
                return 1
            }
            else if(b.marker==='since'){
                return 1
            }
            else if(b.marker==='until'){
                return -1
            }
            return 0
        }
    })
    let newPoints=[]
    for(let point of points){
        let item={}
        for(let key in point){
            if(key!=='cachedDatas') item[key]=point[key]
        }
        newPoints.push(item)
    }
    console.log('points',newPoints)
    let begin=false
    let datas=[]
    for(let i=0;i<points.length;i++){
        let point=points[i]
        if(point.marker==='since') begin=true
        if(point.marker==='until') break
        if(!begin) continue
        let nextPoint
        switch(point.marker){
            case 'since':
                nextPoint=points[i+1]
                if(nextPoint){
                    switch(nextPoint.marker){
                        case 'begin':
                        case 'until':
                            datas.push({since:point.ts,until:nextPoint.ts,cached:false})
                            break
                        case 'end':
                            let dataItem={since:point.ts,until:nextPoint.ts,cached:true}
                            let nextPLineNum=nextPoint.lineNum
                            let lineData=lineToData(fileLines[nextPLineNum])
                            let cachedDatas=[]
                            while(lineData&&lineData.ts>=point.ts){
                                cachedDatas.splice(0,0,lineData)
                                nextPLineNum--
                                lineData=lineToData(fileLines[nextPLineNum])
                            }
                            dataItem.cachedDatas=cachedDatas
                            datas.push(dataItem)
                            break
                    }
                }
                break
            case 'end':
                nextPoint=points[i+1]
                if(nextPoint){
                    datas.push({since:point.ts,until:nextPoint.ts,cached:false})
                }
                break
            case 'begin':
                nextPoint=points[i+1]
                if(nextPoint){
                    let dataItem={since:point.ts,until:nextPoint.ts,cached:true}
                    let nextPLineNum=nextPoint.lineNum
                    let cachedDatas=[]
                    for(let i=point.lineNum;i<=nextPLineNum;i++){
                        cachedDatas.push(lineToData(fileLines[i]))
                    }
                    dataItem.cachedDatas=cachedDatas
                    datas.push(dataItem)
                    break
                }
                break
        }
    }
    filtoutDatas(datas)
    return datas
}
// 对于任意节点，如果开始时间与结束时间一样，并且cached为false，
// 检查前一个节点，如果前一节点结束时间与当前节点时间一样，标记当前节点为删除

// 否则，检查后一节点，如果后一节点开始时间与当前节点时间一样，标记当前节点为删除


function filtoutDatas(datas){
    let toRemove=[]
    for(let i=0;i<datas.length;i++){
        let data=datas[i]
        if(data.since===data.until&&data.cached===false){
            let prevData=datas[i-1]
            if(prevData&&prevData.until===data.since){
                toRemove.push(i)
                continue
            }
            let nextData=datas[i+1]
            if(nextData&&nextData.since===data.until){
                toRemove.push(i)
                continue
            }
        }
    }
    let len=toRemove.length
    
    while(len--){
        // console.log('removing',toRemove[len])
        datas.splice(toRemove[len],1)
    }
}
function lineToData(line){
    return JSON.parse(line)
}
// console.log(getFileDatas('%2Fapi%2Fquote%2Ftick%3Fa%0contract%3Dbtc.usdt-1970-01-01' ,500000, 6000000))
module.exports={getFileDatas,getFileBlocks}