const entity=require('./messages')
const fs=require('fs')
function checkDatas(entity){
    let langs=Object.keys(entity)
    let keys=[]
    for(let lang of langs){
        for(let key of Object.keys(entity[lang])){
            if(!keys.includes(key)) keys.push(key)
        }
    }
    for(let lang of langs){
        for(let key of keys){
            if(!(key in entity[lang])){
                console.log(key,'not in',lang)
            }
        }
    }
    let valKeys={}
    for(let key of keys){
        valKeys[key]=[]
        for(let lang of langs){
            let data=entity[lang][key]
            for(let dKey of Object.keys(data)){
                if(!valKeys[key].includes(dKey)) valKeys[key].push(dKey)
            }
        }
    }
    
    for(let key of keys){
        let cKeys=valKeys[key]
        for(let lang of langs){
            let data=entity[lang][key]
            for(let k of cKeys){
                if(!(k in data)) console.log(k,'not in',lang,key)
            }
        }
    }
}
function sortAndPrintDatas(entity){
    let langs=Object.keys(entity)
    let keys=[]
    for(let lang of langs){
        for(let key of Object.keys(entity[lang])){
            if(!keys.includes(key)) keys.push(key)
        }
    }
    langs.sort((a,b)=>a.localeCompare(b))
    keys.sort((a,b)=>a.localeCompare(b))
    let lines=[]
    for(let key of keys){
        for(let lang of langs){
            let dataName=`${key}_${lang}`
            lines.push(`const ${dataName} = {`)
            let data=entity[lang][key]
            let dKeys=Object.keys(entity[lang][key]).sort((a,b)=>a.localeCompare(b))
            for(let i=0;i<dKeys.length-1;i++){
                lines.push(`    ${dKeys[i]}: "${data[dKeys[i]].replace(new RegExp('\n', 'g'), '\\n')}",`)
            }
            if(dKeys.length>0) lines.push(`    ${dKeys[dKeys.length-1]}: "${data[dKeys[dKeys.length-1]].replace(new RegExp('\n', 'g'), '\\n')}"`)
            lines.push('  }')
        }
    }
    lines.push('export default {')
    for(let lang of langs){
        lines.push(`  ${lang}: {`)
        for(let i=0;i<keys.length-1;i++){
            lines.push(`    ${keys[i]}: ${keys[i]}_${lang},`)
        }
        if(keys.length>0) lines.push(`    ${keys[keys.length-1]}: ${keys[keys.length-1]}_${lang}`)
        lines.push('  },')
    }
    lines.push('}')
    fs.writeFileSync('output.js',lines.join('\n'))
}
// sortAndPrintDatas(entity)
let m=require('./output')
console.log(m)