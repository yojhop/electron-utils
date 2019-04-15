// 将对应的blocks存入文件中（可能需要单进程访问）
const simpleEquals=require('./objectUtils')
const dataGetter=require('./dataGetter')
const fs=require('fs')
function saveDatas(filePath,blocks){
    let oldBlocks=dataGetter.getFileBlocks(filePath)
    let allBlocks=mergeBlocks(oldBlocks,blocks)
    writeBlocks(filePath,allBlocks)
}
// block {since,until,datas}
function mergeBlocks(newBlocks,oldBlocks){
    let points=[]
    for(let block of newBlocks){
        points.push({ts:block.since,marker:'start'})
        points.push({ts:block.until,datas:block.datas,marker:'end'})
    }
    for(let block of oldBlocks){
        points.push({ts:block.since,marker:'start'})
        points.push({ts:block.until,datas:block.datas,marker:'end'})
    }
    points.sort((a,b)=>a.ts-b.ts)
    let depth=0
    let massBlocks=[]
    let curBlock={datas:[]}
    for(let point of points){
        switch(point.marker){
            case 'start':
                if(depth===0) curBlock.since=point.ts
                depth++
                break
            case 'end':
                if(depth>0){
                    curBlock.datas=curBlock.datas.concat(point.datas)
                }
                depth--
                if(depth===0){
                    curBlock.until=point.ts
                    processMassBlock(curBlock)
                    massBlocks.push(curBlock)
                    curBlock={datas:[]}
                }
                break
        }
    }
    return massBlocks
}
function writeBlocks(filePath,blocks){
    let blockInfos=[]
    let dataLines=[]
    let curLineNum=1
    for(let block of blocks){
        blockInfos.push({since:block.since,until:block.until,lineStart:curLineNum,lineEnd:curLineNum+block.datas.length-1})
        for(let data of block.datas){
            dataLines.push(JSON.stringify(data))
        }
        curLineNum+=block.datas.length
    }
    let content=JSON.stringify(blockInfos)+'\n'+dataLines.join('\n')
    fs.writeFileSync(filePath,content)
}
function processMassBlock(massBlock){
    let datas=massBlock.datas
    datas.sort((a,b)=>a.ts-b.ts)
    let lastData=null
    let newDatas=[]
    for(let data of datas){
        if(!simpleEquals(lastData,data)){
            newDatas.push(data)
        }
        lastData=data
    }
    massBlock.datas=newDatas
}
// let oldBlocks=[{since:100,until:300,datas:[{ts:100},{ts:150},{ts:200}]},{since:400,until:500,datas:[{ts:4100},{ts:450},{ts:4700}]}]
// let newBlocks=[{since:50,until:350,datas:[{ts:100},{ts:180}]}]
// console.log(mergeBlocks(newBlocks,oldBlocks))
module.exports={saveDatas}