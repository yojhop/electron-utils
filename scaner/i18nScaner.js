const fs=require('fs')

function isFolder(p){
    let stats=fs.statSync(p)
    return stats.isDirectory()
}
function loadI18nFiles(path){
    let i18nDatas={}
    fs.readdirSync(path).forEach(file => {
        let name=file.split('.')[0]
        let content=fs.readFileSync(`${path}\\${file}`,'utf8')
		let lines=content.split('\n')
		let keys=[]
		lines.forEach(line=>{
			let parts=line.split(':')
			parts.forEach(part=>{
				keys.push(part.trim())
			})
		})
        i18nDatas[name]=keys
        print=true
    })
	return i18nDatas
}
function getVuePaths(path,rets){
	fs.readdirSync(path).forEach(file => {
		if(isFolder(`${path}\\${file}`)){
            getVuePaths(`${path}\\${file}`,rets)
        }
        else{
            if(file.endsWith('.vue')) rets.push(`${path}/${file}`)
        }
	})
}
function checkVueFile(filePath){
    let content=fs.readFileSync(filePath,'utf8')
    let curIndex=0
    let keys=[]
    while(curIndex>=0){
        curIndex+=1
        curIndex=content.indexOf("$t('",curIndex)
        if(curIndex>=0){
            let endIndex=content.indexOf("'",curIndex+4)
            if(endIndex>=0){
                keys.push(content.substring(curIndex+4,endIndex))
            }
        }
    }
    keys.forEach(k=>{
        let [page,name]=k.split('.')
        if(!(page in datas)){
            console.log('cannot found page for',k,filePath)
        }
        else{
            let founds=datas[page].filter(item=>item===name)
            if(founds.length!==2){
                console.log('founds for',k,filePath,'is',founds.length)
            }
        }
    })
}
let datas=loadI18nFiles('C:\\Users\\amos\\Documents\\GitHub\\onetoken-t0\\src\\renderer\\i18n')
const sourceFolder='C:\\Users\\amos\\Documents\\GitHub\\onetoken-t0\\src'
let vuePaths=[]
getVuePaths(sourceFolder,vuePaths)
vuePaths.forEach(path=>{
    checkVueFile(path)
 })