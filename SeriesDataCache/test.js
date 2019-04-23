// 生成测试用的url
// /api/quote/tick?contract=btc.usdt&since=200000&until=300000

// 根据cached的情况选择调用mockurl接口并且拼接
let urlConverter=require('./urlFileConverter')
let fileGetter= require('./dataGetter')
let urlGetter=require('./mockNetworkGetter')
let fileSaver=require('./dataSaver')
getDatas('/api/quote/tick?contract=btc.usdt&since=100000&until=1000000').then(res=>{
    console.log('res',JSON.stringify(res))
})

async function getDatas(url){
    let fileList=urlConverter.getFilesList(url)
    let requests=[]
    let uncachedReqs=[]
    for(let f of fileList){
        let fileDatas=fileGetter.getFileDatas(f.filePath,f.since,f.until)
        console.log(fileDatas,f.filePath,f.since,f.until)
        for(let data of fileDatas){
            data.filePath=f.filePath
            if(!data.cached) uncachedReqs.push(data)
        }
        requests=requests.concat(fileDatas)
    }
    console.log('updateurl',url,uncachedReqs)
    updateUrl(url,uncachedReqs)
    console.log('after set',uncachedReqs)
    let datas=[]
    let blocksMap={}
    // console.log('processing requests')
    for(let req of requests){
        if(req.cached) datas=datas.concat(req.cachedDatas)
        else{
            console.log('mockGetUrl',req.url)
            let urlDatas=await urlGetter.mockGetUrl(req.url)
            datas=datas.concat(urlDatas)
            let block={since:req.since,until:req.until,datas:urlDatas}
            if(!(req.filePath in blocksMap)) blocksMap[req.filePath]=[]
            blocksMap[req.filePath].push(block)
        }
    }
    // console.log('saving datas')
    for(let filePath of Object.keys(blocksMap)){
        fileSaver.saveDatas(filePath,blocksMap[filePath])
    }
    return datas
}
function updateUrl(url,requests){
    // console.log('updateUrl',url,requests)
    let queriesInd=url.indexOf('?')
    if(queriesInd>0){
        let parts=url.substring(queriesInd+1).split('&')
        let kvs=[]
        for(let part of parts){
            let [key,value]=part.split('=')
            if(key!=='since'&&key!=='until') kvs.push(part)
        }
        url=`${url.substring(0,queriesInd+1)}${kvs.join('&')}`
    }
    for(let request of requests){
        request.url=`${url}&since=${request.since}&until=${request.until}`
    }
}