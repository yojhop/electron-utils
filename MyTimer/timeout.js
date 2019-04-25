function setTimeout(cb,delay){
    let endTs=Date.now()+delay
    until(cb,endTs)
}
function until(cb,endTs){
    let nowTs=Date.now()
    if(nowTs<endTs){
        requestAnimationFrame(()=>{
            until(cb,endTs)
        })
    }
    else cb()
}
console.log(Date.now())
setTimeout(()=>{
    console.log(Date.now())
},5000)
module.exports={setTimeout}