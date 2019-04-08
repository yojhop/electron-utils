// 处理计算数据

// 对于每个function,根据其方法主体判断其
k=function(){
    let p=this.a
    let m=this.b+this.a
}

for(let i=0;i<10000;i++){
    getBindList(k)
}
class ComputedBind{

}
function bindAll(vue){
    for(let name of vue.computed){
        let fn=vue.computed[name]
        vue[name]=fn()
        let bindList=getBindList(fn)
    }
}
function getBindList(f){
    let dependendList=[]
    // myVueCtx=proxy({},dependendList)
    let fStr=f.toString().replace(new RegExp('this', 'g'), 'myVueCtx')
    let start=fStr.indexOf('{')
    if(start>=0){
        let end=fStr.lastIndexOf('}')
        if(end>0){
            let funContent=fStr.substring(start+1,end)
            funContent = 'let myVueCtx=proxy({},dependendList);'+funContent
            let fn=new Function('dependendList',funContent)
            fn(dependendList)
        }
    }
    return dependendList
}
function proxy(obj,list){
    return new Proxy(obj, {
        get: (target, name)=> {
            if(!list.includes(name)) list.push(name)
            if (!(name in target)) {
                return undefined;
            }
            return target[name];
        }
    })
}