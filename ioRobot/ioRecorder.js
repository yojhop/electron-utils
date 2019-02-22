
const {IOListener} = require('./ioListener')
const {listenSupportedEvents}=require('./config')
class Recorder{
    constructor(){
        this.lastRecord=null
        this.records=[]
        this.listener=new IOListener(require('iohook'),listenSupportedEvents)
        this.status=''
    }
    startRecord(){
        this.status='started'
        for(let event of listenSupportedEvents){
            this.listener.register(event,e=>{
                if(this.status==='started'){
                    this.tryRecord(e)
                }
            })
        }
        this.listener.start()
    }
    stopRecord(){
        this.status='stopped'
        this.saveToFile()
    }
    getRecords(){
        return this.records
    }
    saveToFile(){
        let fs=require('fs')
        let path=require('path')
        let pretty=JSON.stringify(this.records,null,2)
        let recordPath=path.join(__dirname, './ioRecords.json')
        fs.writeFileSync(recordPath, pretty)
    }
    record(e){
        let lastIndex=this.records.length-1
        if(lastIndex>=0&&this.records[lastIndex].type===e.type&&!e.type.startsWith('key')){
            this.records.splice(lastIndex,1,e)
        }
        else{
            this.records.push(e)
        }
        this.lastRecord=e
    }
    tryRecord(e){
        if(this.lastRecord===null){
            e.ts=new Date().getTime()
            this.record(e)
        }
        else{
            if(this.lastRecord.type===e.type){
                let nowTime=new Date().getTime()
                if(nowTime-this.lastRecord.time>=100){
                    e.ts=nowTime
                    this.record(e)
                }
            }
            else{
                e.ts=new Date().getTime()
                this.record(e)
            }
        }
    }
}
module.exports={Recorder}