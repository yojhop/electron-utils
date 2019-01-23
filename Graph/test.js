// 测试类TestClass，方法都是简单地打印方法是否调用，promise在完成后打印
const {GraphProcessor}=require('./Graph')
const yaml =require('js-yaml')
const fs=require('fs')
class TestClass{
    constructor(){

    }
    hasOppositePending(){
        return new Promise((resolve,reject)=>{
            console.log('hasOppositePending')
            resolve(true)
        })
    }
    alertCancelBeforeCover(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                console.log('alertCancelBeforeCover')
                resolve()
            },2000)
        })
    }
    final(){
        console.log('finished')
    }
    hasOppositeHolding(){
        console.log('hasOppositeHolding')
    }
}
let graph=yaml.safeLoad(fs.readFileSync('./test.yml', 'utf8'))
let processor=new GraphProcessor(new TestClass(),graph)
processor.start()