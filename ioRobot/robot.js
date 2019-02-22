let {Recorder}=require('./ioRecorder')
let {perform,startAll}=require('./simulator')
class Robot{
    constructor(){
        this.recorder=new Recorder()
    }
    startRecord(){
        console.log('starting recording')
        this.recorder.startRecord()
    }
    stopRecord(){
        console.log('stopping recording')
        this.recorder.stopRecord()
    }
    replay(){
        console.log('starting replay')
        this.execute(0)
        console.log('replay ened')
    }
    execute(i){
        let records=this.recorder.getRecords()
        if(i===records.length-1){
            startAll()
            return
        }
        if(i-1>=0){
            let lastTs=records[i-1].ts
            let curTs=records[i].ts
            setTimeout(()=>{
                perform(records[i])
                this.execute(i+1)
            },curTs-lastTs)
        }
        else{
            perform(records[i])
            this.execute(i+1)
        }
    }
}
module.exports={Robot}