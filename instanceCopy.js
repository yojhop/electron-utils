function clone(instance){

    let copy = Object.assign( {}, instance );
    Object.setPrototypeOf( copy, instance.__proto__ )
    return copy
}
class test{
    constructor(a,b){
        this.a=a
        this.b=b
    }
    test(){
        console.log(this.a,this.b)
    }
}
let original=new test(1,2)
let copy=clone(original)
copy.test()