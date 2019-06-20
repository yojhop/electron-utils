import {simpleCopy} from './SimpleCopy'
class DuplicatedObject{
    constructor(original){
        this.original=simpleCopy(original)
        this.current=simpleCopy(current)
    }
    syncCurrent(){
        this.original=simpleCopy(this.current)
    }
    update()
}