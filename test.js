function test(cb){
    
}
let p=new Promise((resolve,reject)=>{
    setTimeout(()=>{resolve(1)},3000)
})
test(p)