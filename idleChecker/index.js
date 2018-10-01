class IdleChecker{
    constructor(pushInterval,statusCb,checkNums=10){
        this.pushed=0
        this.executed=0
        this.pushInterval=pushInterval
        this.checkNums=checkNums
        this.hasIdle=true
        this.intervalId=null
        this.statusCb=statusCb
    }
    start(){
        this.pushed=0
        this.executed=0
        if(this.intervalId){
            clearInterval(this.intervalId)
        }
        this.intervalId=setInterval(()=>{this._push()},this.pushInterval)
    }
    _push(){
        // console.log('pushed',this.pushed,'executed',this.executed,this.checkNums)
        if(this.pushed>0&&this.pushed%this.checkNums===0){
            const newStatus=this.pushed===this.executed?true:false
            console.log('pushed',this.pushed,'executed',this.executed)
            if(newStatus!==this.hasIdle){
                this.hasIdle=newStatus
                this.statusCb(this.hasIdle)
            }
        }
        this.pushed++
        requestIdleCallback(()=>{
            this.executed++
        })
         
    }
}

const checker=new IdleChecker(1000,(status)=>{console.log('idle status changed',status)})
checker.start()