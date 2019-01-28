const {Promise}=require('./myPromise')

function testThen(){
    new Promise((resolve,reject)=>{setTimeout(()=>{
        resolve(1)
    },1000)}).then(res=>{
        if(res===1) console.log('test Then pass')
        else console.log('test then failed')
    }).catch(err=>{
        console.log('test then failed')
    })
}
function failPrint(funcName){
    console.log(`test ${funcName} failed`)
}
function succeedPrint(funcName){
    console.log(`test ${funcName} succeed`)
}
function testCatch(){
    new Promise((resolve,reject)=>{setTimeout(()=>{
        reject(1)
    },1000)}).then(res=>{
        console.log('test catch failed in then')
    }).catch(err=>{
        if(err===1) console.log('test catch pass')
        else console.log('test catch failed in catch')
    })
}
function testChain(){
    let i=0
    new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(1)
        },1000)
    }).then(res=>{
        if(i!==0||res!==1) console.log('testChain failed') 
        i=1
    }).then(res=>{
        if(i!==1||res!==1) console.log('testChain failed') 
        i=2
    })
    .then(res=>{
        if(i!==2||res!==1) console.log('testChain failed') 
        else console.log('testChain succeed')
    })
}
function testCatchChain(){
    let i=0
    new Promise((resolve,reject)=>{
        reject(2)
    }).then(res=>{
        failPrint('catchChain1')
    }).catch(err=>{
        if(i!==0||err!==2) failPrint('catchChain2')
    }).then(res=>{
        if(res!==undefined) failPrint('catchChain3')
    }).then(()=>{
        console.log(c)
    }).then(()=>{
        failPrint('catchChain4')
    }).catch(()=>{
    }).catch(()=>{
        failPrint('catchChain5')
    }).then(res=>{
        if(res!==undefined) failPrint('catchChain6')
        else succeedPrint('catchChain')
    })
}
testThen()
testCatch()
testChain()
testCatchChain()