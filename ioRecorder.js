const ioHook=require('iohook')
ioHook.on('mousemove',event=>{
    console.log('mousemove',event)
})
ioHook.on('keydown',e=>{
    console.log('keydown',e)
})
ioHook.on('keyup',e=>{
    console.log('keyup',e)
})
ioHook.on('mouseclick',e=>[
    console.log('mouseclick',e)
])
ioHook.on('mousedown',e=>[
    console.log('mousedown',e)
])
ioHook.on('mouseup',e=>[
    console.log('mouseup',e)
])
ioHook.on('mousedrag',e=>{
    console.log('mousedrag',e)
})
ioHook.on('mousewheel',e=>{
    console.log('mousewheel',e)
})
ioHook.start()
class Recorder{
    constructor(){
        this.events=['keyup','keydown','mousemove','mouseclick','mouseup','mousedrag','mousewheel','mousewheel']
        this.lastRecord=null
        this.records=[]
    }
    startRecord(){
        for(let event of this.events){
            ioHook.on(event,e=>{
                this.tryRecord(e)
            })
        }
    }
    record(e){
        let lastIndex=this.records.length-1
        // console.log(e)
        if(lastIndex>=0&&this.records[lastIndex].type===e.type){
            this.records.splice(lastIndex,1,e)
            console.log('')
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