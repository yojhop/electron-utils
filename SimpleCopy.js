// 复制函数

// 如果为[object Object]则对每个key,copy其对应的value
// 如果为[object Array]则copy列表中每个元素加入列表
// 其他则直接赋值
let toString=Object.prototype.toString
function simpleCopy(data){
    let dataType=toString.call(data)
    switch(dataType){
        case '[object Object]':
            let newObj={}
            for(let key in data){
                newObj[key]=simpleCopy(data[key])
            }
            return newObj
        case '[object Array]':
            let newArr=[]
            for(let item of data) newArr.push(simpleCopy(item))
            return newArr
        default:
            return data
    }
}
// 一开始往栈放入根节点，每次都对栈顶元素进行检查，如果当前子元素的类型为数组或者对象，则压栈临时变量，下标和元素值，否则赋值并且移动下标
// 如果当前已处理的下标小于该元素的子元素数量，则移动下标并且进行处理，如果当前节点是父节点的最后一个元素         

function stackCopy(obj){
    let stack=new Stack()
    let ret=getInitObj(obj)
    stack.push({curIndex:0,object:obj,indexInParent:null,copyObj:ret})
    while(true){
        let top=stack.top()
        if(top===undefined) break
        let type=getType(top.object)
        switch(type){
            case 'Object':
                let keys=Object.keys(top.object).sort((a,b)=>a.localeCompare(b))
                if(top.curIndex<keys.length){
                    let key=keys[top.curIndex]
                    let subObj=top.object[key]
                    if(objHasChild(subObj)){
                        let copyObj=getInitObj(subObj)
                        top.copyObj[key]=copyObj
                        stack.push({curIndex:0,object:subObj,indexInParent:top.curIndex,copyObj})
                    }
                    else{
                        top.copyObj[key]=subObj
                        top.curIndex++
                    }
                }
                else{
                    stack.pop()
                    let newTop=stack.top()
                    if(newTop) newTop.curIndex=top.indexInParent+1
                    else break
                }
                
        }
    }
    return ret
}
class StockCopy{
    constructor(obj){
        this.stack=new Stack()
        this.ret=getInitObj(obj)
        this.stack.push({curIndex:0,object:obj,indexInParent:null,copyObj:this.ret})
    }
    startCopy(){
        let needProcess=this.processTop()
        while(needProcess){
            needProcess=this.processTop()
        }
    }
    processTop(){
        let top=this.stack.top()
        if(top===undefined) return false
        let type=getType(top.object)
        switch(type){
            case 'Object':
                let keys=Object.keys(top.object).sort((a,b)=>a.localeCompare(b))
                if(top.curIndex<keys.length){
                    let key=keys[top.curIndex]
                    let subObj=top.object[key]
                    if(objHasChild(subObj)){
                        let copyObj=getInitObj(subObj)
                        top.copyObj[key]=copyObj
                        this.stack.push({curIndex:0,object:subObj,indexInParent:top.curIndex,copyObj})
                    }
                    else{
                        top.copyObj[key]=subObj
                        top.curIndex++
                    }
                }
                else{
                    this.stack.pop()
                    let newTop=this.stack.top()
                    if(newTop) newTop.curIndex=top.indexInParent+1
                }
                
        }
        return true
    }
}
function objHasChild(obj){
    let type=getType(obj)
    return type==='Object'||type==='Array'
}
function getType(obj){
	let objType=Object.prototype.toString.call(obj)
    return objType.substring(8,objType.length-1)
}
function getInitObj(obj){
    let type=getType(obj)
    switch(type){
        case 'Object':
            return {}
        case 'Array':
            return []
        default:
            return null
    }
}
class Stack{
    constructor(){
        this.datas=[]
    }
    push(item){
        this.datas.push(item)
    }
    pop(){
        if(this.datas.length>0){
            let item=this.datas[this.datas.length-1]
            this.datas.length=this.datas.length-1
            return item
        }
    }
    top(){
        if(this.datas.length>0){
            let item=this.datas[this.datas.length-1]
            return item
        }
    }
}
let m={a:{ab:2,ac:2},b:{bd:3,be:4}}
// let sc=new StockCopy(m)
console.log(stackCopy(m))