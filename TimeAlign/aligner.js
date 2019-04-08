// 对齐时间轴

// 对齐时间轴类
// 属性 时间轴开始时间，类开始时间

// 方法 设置时间轴开始时间
// 刷新类开始时间

// 延迟处理，参数时间轴时刻，回调函数
// 对比参数时间轴时刻execTime-时间轴开始时间startTime

// 类开始时间lineStart以及当前时间curTime

// diff=execTime-startTime+lineStart-curTime
// diff=diff<0?0:diff
class TimeAligner{
    startAlign(startTime){
        this.startTime=startTime
        this.lineStart=new Date().getTime()
    }
    alignTime(execTime,cb){
        let diff=execTime-this.startTime+this.lineStart-new Date().getTime()
        // console.log(execTime,this.startTime,this.lineStart,new Date().getTime(),execTime-this.startTime+this.lineStart-new Date().getTime())
        diff=diff<0?0:diff
        setTimeout(()=>{
            cb&&cb()
        },diff)
    }
}