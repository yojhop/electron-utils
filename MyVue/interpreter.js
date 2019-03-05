// import '../copy'
let dataModel=null
let toString=Object.prototype.toString
function interpret(v){
    window.addEventListener('load', function() {
        let inter=new Interpreter(v.data,document.body)
        let newBody=inter.createDomTree()
        console.log('newbody',newBody)
        document.body=newBody
    })
}
function bindVFor(parent,oriEl,content){

}
function copy(obj){
    return JSON.parse(JSON.stringify(obj))
}
function getData(node,path){
    let data={}
    // debugger
    for(let atr of node.attributes){
        data[atr.name]=atr.value
    }
    if(node.children.length===0) data.innerHTML=node.innerHTML
    data.ast_path=path
    return data
}
function getAst(node,path){
    let nodeChildren=node.children
    let children=[]
    // for(let child of nodeChildren){
    //     children.push(getAst(child))
    // }
    path=path?path:node.tagName
    let childLen=nodeChildren.length
    for(let index=0;index<childLen;index++){
        let childPath=`${path}-${nodeChildren[index].tagName}${index}`
        children.push(getAst(nodeChildren[index],childPath))
    }

    // debugger
    
    return new Node(children,getData(node,path),node.tagName)
}
class Interpreter{
    constructor(dataModel,root){
        this.dataModel=dataModel
        this.root=root
        this.ast=getAst(root)
        this.bindings={}
    }
    createDomTree(node){
        node=node?node:this.ast
        return this.buildNode(node,this.dataModel)
    }
    isKeyword(key){
        return ['v-for','v-if','v-show'].includes(key)
    }
    // 对于for节点，传入本节点，复制一份全局变量并且将迭代的数据放入其中，传递给函数
    buildFor(node,model){
        let forNodes=[]
        debugger
        let sentence=node.data['v-for']
        let parts=sentence.split(' ').filter(item=>item!=='')
        if(parts.length===3&&model[parts[2]]){
            let el=document.createElement(node.tagName)
            let datas=model[parts[2]]
            for(let data of datas){
                let modelCopy=copy(model)
                modelCopy[parts[0]]=data
                let children=node.children
                for(let child of children){
                    this.appendChild(el,this.buildNode(child,modelCopy))
                    // el.appendChild(this.buildNode(child,modelCopy))
                }
            }
            forNodes.push(el)
        }
        return forNodes
    }
    appendChild(domNode,childDoms){
        if(toString.call(childDoms)==='[object Array]'){
            for(let child of childDoms){
                domNode.appendChild(child)
            }
        }
        else{
            domNode.appendChild(childDoms)
        }
    }
    // 对于每个节点的创建，传入ast以及该节点对应的数据
    buildNode(node,data){
        if(node.data['v-for']){
            return this.buildFor(node,data)
        }
        else{
            let el=document.createElement(node.tagName)
            for(let key in el.data){
                if(!this.isKeyword(key)) el.set
            }
            for(let child of node.children){
                this.appendChild(el,this.buildNode(child,data))
            }
            return el
        }
    }
}
class Node{
    constructor(children,data,tagName){
        this.children=children
        this.data=data
        this.tagName=tagName
    }
}