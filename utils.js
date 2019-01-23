function isPromise(obj){
    return Object.prototype.toString.call(obj)==='[object Promise]'
}
module.exports={isPromise}