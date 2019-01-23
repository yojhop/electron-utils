
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
                    console.log(e)
                    this.tryRecord(e)
                }
            })
        }
        this.listener.start()
    }
    stopRecord(){
        this.status='stopped'
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
        if(this.lastRecord===null) this.record(e)
        else{
            if(this.lastRecord.type===e.type){
                let nowTime=new Date().getTime()
                if(nowTime-this.lastRecord.time>=100) this.record(e)
            }
            else{
                this.record(e)
            }
        }
    }
}
let recorder=new Recorder()
recorder.startRecord()