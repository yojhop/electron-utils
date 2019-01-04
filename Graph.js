function process(data,graph){
    if(graph.type==='start'){
        processNode(data,graph.next)
    }
}
function processNode(data,node){
    switch(node.type){
        case 'statement':
            processStatement(data,node)
            break
        case 'operation':
            processOperation(data,node)
            break
        default:
        throw new Error('unsupported type: '+node.type)
    }
}
function processStatement(data,statement){
    let result=data[statement.name]()
    if(result){
        if(statement.yes) processNode(data,statement.yes)
    }
    else if(statement.no) processNode(data,statement.no)
}
function processOperation(data,operation){
    data[operation.name]()
    if(operation.next){
        processNode(data,operation.next)
    }
}
export { process }