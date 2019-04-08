function getType(obj){
	let objType=Object.prototype.toString.call(obj)
    return objType.substring(8,objType.length-1)
}
export {getType}