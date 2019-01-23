let {Recorder}=require('./ioRecorder')
let {perform}=require('./simulator')
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
        for(let e of this.recorder.getRecords){
            perform(e)
        }
        console.log('replay ened')
    }
}
module.exports={Robot}