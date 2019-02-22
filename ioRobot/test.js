//  let {Robot}=require('./robot')
//  let robot=new Robot()
//  robot.startRecord()
//  setTimeout(()=>{
//      robot.stopRecord()
//     //  robot.replay()
//  },5000)
 let {perform,startAll}=require('./simulator')
 let fs=require('fs')
         let path=require('path')
         let recordPath=path.join(__dirname, './ioRecords.json')
         let content=fs.readFileSync(recordPath)
         let records=JSON.parse(content)
         function execute(i){
             if(i===records.length-1){
                 return
             }
             if(i-1>=0){
                 let lastTs=records[i-1].ts
                 let curTs=records[i].ts
                 setTimeout(()=>{
                     perform(records[i])
                     execute(i+1)
                     startAll()
                 },curTs-lastTs)
             }
             else{
                 perform(records[i])
                 execute(i+1)
             }
         }
         execute(0)