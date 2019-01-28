const {promiseAll}=require('./utils')
const {Promise}=require('./myPromise')

function testAllResolved(){
    let res1
    let res2
    let promise1=new Promise((resolve,reject)=>{
        setTimeout(()=>{
            res1=1
            resolve(res1)
        },2000)
    })
    let promise2=new Promise((resolve,reject)=>{
        setTimeout(()=>{
            res2=2
            resolve(res2)
        },1000)
    })
    promiseAll([promise1,promise2]).then(res=>{
        if(res.length&&res.length===2&&res[0]===res1&&res[1]===res2) console.log('testAllResolved pass')
        else console.log('testAllResolved failed: not equal')
    }).catch(err=>{
        console.log('testAllResolved failed',err)
    })
}
function testError(){
    let error
    let promise1=new Promise((resolve,reject)=>{
        setTimeout(()=>{
            error='failed on first'
            reject(error)
        },2000)
    })
    let promise2=new Promise((resolve,reject)=>{
        setTimeout(()=>{
            res2=2
            resolve(res2)
        },1000)
    })
    promiseAll([promise1,promise2]).then(res=>{
        console.log('testError failed 1')
    }).catch(err=>{
        if(err===error) console.log('testError pass 1')
        else console.log('testError failed: not equal 1')
    })
    error
    promise1=new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(1)
        },2000)
    })
    promise2=new Promise((resolve,reject)=>{
        setTimeout(()=>{
            error='failed on second'
            reject(error)
        },1000)
    })
    promiseAll([promise1,promise2]).then(res=>{
        console.log('testError failed 2')
    }).catch(err=>{
        if(err===error) console.log('testError pass 2')
        else console.log('testError failed: not equal 2')
    })
}
testAllResolved()
testError()