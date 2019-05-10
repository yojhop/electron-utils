
const eventsMap=[]

function registerEvent({target,name,cb,order}){
    let targetMap=getValue(target)
    if(targetMap){
        if(!(name in targetMap)){
            targetMap[name]=[]
            target.on(name,event=>{
                execFunctions(targetMap[name],event)
            })
        }
        for(let item of targetMap[name]){
            if(item.cb===cb) return
        }
        targetMap[name].push({cb,order})
        targetMap[name].sort((a,b)=>a.order-b.order)
    }
    else{
        addKV(target,{name:[{cb,order}]})
    }
}

function getValue(target){
    for(let m of eventsMap){
        if(m.key===target){
            return m.value
        }
    }
    return undefined
}
function addKV(key,value){
    let item={key,value}
    eventsMap.push(item)
    return item
}
function execFunctions(fns,...args) {
    return new Promise((resolve, reject) => {
      const walkFn = (i) => {
        if (i < fns.length) {
          try{
            let ret=fns[i](...args)
            if(Object.prototype.toString.call(ret)==='[object Promise]'){
                ret.then(() => {
                    walkFn(++i)
                }).catch(() => {
                    walkFn(++i)
                })
            }
            else{
                walkFn(++i)
            }
          }
          catch(e){
            walkFn(++i)
          }
          
        } else {
          resolve()
        }
      }
      walkFn(0)
    })
  }