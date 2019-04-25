let timer=require('./timeout')
console.log(Date.now())
timer.setTimeout(()=>{
    console.log(Date.now())
},5000)