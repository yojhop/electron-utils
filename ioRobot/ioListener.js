class IOListener{
    constructor(hook,supportedEvents){
        this.hook=hook
        this.downList=[]
        this.listners={}
        this.listenedEvents=[]
        this.supportedEvents=supportedEvents
        this.hook.start()
    }
    register(eName,cb){
        if(!this.supportedEvents.includes(eName)){
            throw new Error('Not supported event')
        }
        if(!(eName in this.listners)){
            this.listners[eName]=[]
        }
        this.listners[eName].push(cb)
        if(!this.listenedEvents.includes(eName)){
            switch(eName){
                case 'keydown':
                    this.listenKeyDown()
                case 'keyup':
                    this.listenKeyUp()
                    break
                default:
                    this.listenDefault(eName)
            }
        }
    }
    start(){
        this.hook.start()
    }
    listenKeyDown(){
        this.hook.on('keydown',e=>{
            if(!this.downList.includes(e.keycode)){
                this.downList.push(e.keycode)
                if('keydown' in this.listners){
                    for(let listener of this.listners['keydown']){
                        listener(e)
                    }
                }
            }
        })
    }
    listenKeyUp(){
        this.hook.on('keyup',e=>{
            let len=this.downList.length
            while(len--){
                if(this.downList[len]===e.keycode) this.downList.splice(len,1)
            }
            if('keyup' in this.listners){
                for(let listener of this.listners['keyup']){
                    listener(e)
                }
            }
        })
    }
    listenDefault(name){
        this.hook.on(name,e=>{
            if(name in this.listners){
                for(let listener of this.listners[name]){
                    listener(e)
                }
            }
        })
    }
}
module.exports={IOListener}