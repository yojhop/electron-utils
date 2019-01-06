
const {KeyEventListener} = require('./KeyEventListener')
const {listenSupportedEvents}=require('./config')
class Recorder{
    constructor(){
        this.lastRecord=null
        this.records=[]
        this.ioHook=require('iohook')
    }
    startRecord(){
        for(let event of listenSupportedEvents){
            this.ioHook.on(event,e=>{
                this.tryRecord(e)
            })
        }
        this.ioHook.start()
        setTimeout(()=>{this.saveToFile()},5000)
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
        // console.log(e)
        if(lastIndex>=0&&this.records[lastIndex].type===e.type&&!e.type.startsWith('key')){
            this.records.splice(lastIndex,1,e)
            console.log('replace last with',e)
        }
        else{
            this.records.push(e)
        }
    }
    tryRecord(e){
        if(this.lastRecord===null) this.record(e)
        else{
            if(this.lastRecord.event.type===e.type){
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