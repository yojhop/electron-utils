class KeyEventHandler{
    constructor(hook){
        this.hook=hook
        this.downList=[]
        this.listners={}
    }
    listen(eName,cb){
        if(!(eName in this.listners)){
            this.listners[eName]=[]
        }
        this.listners[eName].push(cb)
    }
    start(){
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
        this.hook.on('keyup',e=>{
            let len=this.downList.length
            while(len--){
                if(this.downList[len]===e.keycode) this.downList.splice(len,1)
            }
        })
        this.hook.start()
    }
}
export {KeyEventHandler}