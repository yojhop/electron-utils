function add(a,b){
    if(a===''||b===''||isNaN(a)||isNaN(b)) return ''
    
}
function getDigits(str){

}
function trimZeros(str){
    let start=-1
    for(let i=0;i<str.length;i++){
        let chr=str.substr(i,1)
        if(chr!=='0'){
            if(start===-1){
                if(chr==='.') start=i-1
                else start=i
            }
            break
        }
    }
    return str.substring(start)
}
function getPlaces(str){
    let pIndex=str.indexOf('.')
    if(pIndex<0) return {int:str.length,decimal:0}
    else return {int:pIndex,decimal:str.length-1-pIndex}
}