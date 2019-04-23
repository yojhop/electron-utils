function mockGetUrl(url){
    return new Promise((resolve,reject)=>{
        // let queriesIndex=url.indexOf('?')
        // if(queriesIndex>0){
        //     let since=null
        //     let until=null
        //     let parts=url.substring(queriesIndex+1).split('&')
        //     for(let part of parts){
        //         let [key,value]=part.split('=')
        //         if(key==='since') since=+value
        //         else if(key==='until') until=+value
        //     }
        //     if(since!==null&&until!==null){
        //         let datas=[]
        //         while(since<until){
        //             datas.push({ts:since})
        //             since+=1000
        //         }
        //         resolve(datas)
        //         return
        //     }
        // }
        resolve([])
    })
    
}
module.exports={mockGetUrl}