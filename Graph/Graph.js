// 处理类

const {isPromise}=require('../utils')
class GraphProcessor{
    constructor(data, graph){
        this.data=data
        this.graph=graph
        this.tagMap={}
    }
    start(){
        this.createTagMap()
        if(this.graph.type==='start') this.processNode( this.graph.next)
        else throw new Error('type of root node should be start')
    }
    processStatement(node){
        // 如果返回值为promise,需要等返回结果
        let statement = this.data[node.name]()
        let cb=(ret)=>{
            if(ret){
                if(node.yes) this.processNode( node.yes)
            }else if(node.no){
                this.processNode( node.no)
            }
        }
        if (isPromise(statement)) {
            statement.then(res=>{
                cb(res)
            })
        }
        else cb(statement)
    }
    // 如果类型为goto,则查找相应name所指定的tag对应的node,执行
    processGoto(node){
        if(node.name in this.tagMap) this.processNode(this.tagMap[node.name])
    }
    processOperation(node){
        let ret = this.data[node.name]()
        if (node.next) {
            if (isPromise(ret) ) {
                ret.then(() => {
                    this.processNode( node.next)
                })
            } else {
                this.processNode( node.next)
            }
        }
    }
    processNode(node) {
        switch(node.type){
            case 'statement':
                this.processStatement(node)
                break
            case 'operation':
                this.processOperation(node)
                break
            case 'goto':
                this.processGoto(node)
                break
            default:
                throw new Error(`unsupported node type ${node.type}`)
        }   
    }
    // 检查graph是否合法，如果有不一样的Node有相同tag，非法
    createTagMap(){
        this.walkGraphCreateTagMap(this.graph)
    }
    walkGraphCreateTagMap(node){
        if(node.tag){
            if(node.tag in this.tagMap) throw new Error(`duplicated tag name ${node.tag}`)
            this.tagMap[node.tag]=node
        }
        if(node.yes) this.walkGraphCreateTagMap(node.yes)
        if(node.no) this.walkGraphCreateTagMap(node.no)
        if(node.next) this.walkGraphCreateTagMap(node.next)
    }
}




module.exports= { GraphProcessor }
  