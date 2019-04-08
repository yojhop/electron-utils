// 对于每个对象，获取所有的path，对数组和对象获取其子元素数量，
// 保存子元素数量与path的键值对，每隔一段时间检查一次，对数量增长的path打印出来
import {getType} from '../plainObjectUtils'
import {object2KVs} from '../ObjectKVConverter'
function observeObject(obj,interval=500){
    let cntMap={}
    setInterval(()=>{
        let increasePaths={}
        let kvs=object2KVs(obj)
        kvs.splice(0,0,{path:'.',value:obj})
        for(let kv of kvs){
            let cnt=getCnt(kv.value)
            if((!(kv.path in cntMap)&&shouldCnt(kv.value)&&cnt>0)||cnt>cntMap[kv.path]){
                increasePaths[kv.path]={o:0,new:cnt}
                cntMap[kv.path]=cnt
            }
        }
        if(Object.keys(increasePaths).length>0) console.log('increasing Heap', increasePaths)
    },interval)
}
function shouldCnt(o){
    let oType=getType(o)
    return oType==='Array'||oType==='Object'
}
function getCnt(o){
    let oType=getType(o)
    switch(oType){
        case 'Array':
            return o.length
        case 'Object':
            return Object.keys(o).length
        default:
            return 1
    }
}