import { resolve } from "dns";

function getFPS(){
    return new Promise((resolve,reject)=>{
        let until=Date.now()+1000
        let cnt=0
        let checkFrames=()=>{
            requestAnimationFrame(()=>{
                cnt++
                if(Date.now()<until){
                    checkFrames()
                }
                else{
                    resolve(cnt)
                }
            })
        }
        checkFrames()
    })
    // let since=Date.now()
    
}

setInterval(()=>{
    getFPS().then(fps=>{console.log('fps',fps)})
},3000)