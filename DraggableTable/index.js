
class TableDraggable{
    constructor(table,doc){
        let ths=table.querySelectorAll('th')
        
        for(let th of ths){
            new TableHeaderDraggable(th,doc)
        }
    }
}

class TableHeaderDraggable{
    constructor(th,doc){
        this.th=th
        this.dragging=false
        this.downX=null
        this.lastX=null
        this.width=this.th.offsetWidth
        this.doc=doc
        this.registerEvents()
        
    }
    moveEvent(e){
        if(this.dragging){
            let xDiff=e.clientX-this.downX
            this.th.style.width=this.width+2*xDiff
            // this.width=this.width+xDiff
            let diffWithLast=e.clientX-this.lastX
            if(diffWithLast>0){
                this.th.classList.add('expand')
                this.th.classList.remove('shrink')
            }
            else if(diffWithLast<0){
                this.th.classList.add('shrink')
                this.th.classList.remove('expand')
            }
            this.lastX=e.clientX
        }
    }
    registerEvents(){
        // 鼠标按下事件mousedown，设置dragging为true，记录按下的x位置，并且记录为上一个x位置
        this.th.addEventListener('mousedown',e=>{
            this.downX=e.clientX
            this.lastX=e.clientX
            this.dragging=true
            console.log('mousedown')
        })
        // 鼠标离开事件mouseleave和鼠标按键放开,设置dragging为false
        this.th.addEventListener('mouseleave',e=>{
            this.moveEvent(e)
            this.dragging=false
            this.width=this.th.offsetWidth
            this.th.classList.remove('shrink')
            this.th.classList.remove('expand')
            console.log('mouseleave')
        })
        this.th.addEventListener('mouseup',()=>{
            this.dragging=false
            this.width=this.th.offsetWidth
            this.th.classList.remove('shrink')
            this.th.classList.remove('expand')
            console.log('mouseup')
        })
        // 鼠标移动事件mousemove,如果dragging为true,计算当前位置与鼠标按下x位置的差值，th的宽度=th的宽度+差值
        // 记录为上一个x位置
        // 如果当前位置的x小于上一个x位置，则加入类shrink，删除类expand,如果当前位置的x大于上一个x位置，则删除类shrink,加入类expand
        this.th.addEventListener('mousemove',e=>{
            this.moveEvent(e)
            if(this.dragging) console.log('mousemove')
        })
    }
}