const filtouts=['since','until']
const moment=require('moment')
const fs=require('fs')
function filtHost(url){
    if(url.startsWith('http://')){
        let startInd=url.indexOf('/',7)
        if(startInd>0) return url.substring(startInd)
    }
    else if(url.startsWith('https://')){
        let startInd=url.indexOf('/',8)
        if(startInd>0) return url.substring(startInd)
    }
    return url
}
function getFilesList(url){
    url=filtHost(url)
    url=url.replace(new RegExp('/', 'g'), '%2F')
    let questionInd=url.indexOf('?')
    let since
    let until
    if(questionInd>=0){
        let keyValPairs=url.substring(questionInd+1).split('&')
        url=url.substring(0,questionInd)+'%3Fa%0'
        let eqs=[]
        for(let eqStr of keyValPairs){
            let [key,val]=eqStr.split('=')
            if(key==='since') since=Number(val)
            else if(key==='until') until=Number(val)
            else eqs.push(`${key}%3D${val}`)
        }
        
        url=`${url}${eqs.join('%26')}`
    }
	//console.log('getting dates',since,until,url)
    let dates=getDates(since,until)
	//console.log(dates)
    let files=[]
    for(let date of dates) files.push({filePath:`${url}-${date.date}`,since:date.since,until:date.until})
    return files
}
function getSearchingTs(since,until){
    if(isNaN(since)) return []
    until=isNaN(until)?new Date().getTime():until
    let daySpan=24*3600*1000
    let searchingTs=[]
    let dateStart=Math.floor(since/daySpan)*daySpan
    let start=since
    // debugger
    while(dateStart<until){
        let curDate=moment(dateStart).format('YYYY-MM-DD')
        let dateEnd=dateStart+daySpan
        let end=dateEnd>until?until:dateEnd
        if(end>start) searchingTs.push({date:curDate,start,end})
        dateStart=dateEnd
        start=dateEnd
    }
    return searchingTs
}
// 根据开始时间以及结束时间获得需要查找的文件列表
function getDates(since,until){
    if(!since) return []
    until=until?until:new Date().getTime()
    let daySpan=24*3600*1000
    let start=Math.floor(since/daySpan)*daySpan
    let dates=[]
    while(start<until){
		let begin=start>=since?start:since
		let end=start+daySpan
		end=end<=until?end:until
        dates.push({date:moment(start).format('YYYY-MM-DD'),since:begin,until:end})
        start+=daySpan
    }
    return dates
}
function getFileContent(filePath){
    if(fs.existsSync(filePath)) return fs.readFileSync(filePath,'utf8')
    return ''
}

let fileItems=getFilesList('/api/v1/zhubi?since=19000029100&until=19000029300&source=t0')
for(let item of fileItems){
    let content=getFileContent(item.filePath)
    if(content!==''){
        
    }
}
// console.log(getFilesList('/api/v1/zhubi?since=19000029100&until=19000029300&source=t0'))
module.exports={getFilesList}