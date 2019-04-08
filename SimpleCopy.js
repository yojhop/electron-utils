// 复制函数

// 如果为[object Object]则对每个key,copy其对应的value
// 如果为[object Array]则copy列表中每个元素加入列表
// 其他则直接赋值
let toString=Object.prototype.toString
function simpleCopy(data){
    let dataType=toString.call(data)
    switch(dataType){
        case '[object Object]':
            let newObj={}
            for(let key in data){
                newObj[key]=simpleCopy(data[key])
            }
            return newObj
        case '[object Array]':
            let newArr=[]
            for(let item of data) newArr.push(simpleCopy(item))
            return newArr
        default:
            return data
    }
}
建立栈，每次处理时将当前Node，顺序排序的Index，入栈处理完后出栈，根据index处理下一个数据，每处理完一个节点，将其返回并且存储，结束条件为栈空
压栈数据包括被压入节点的父节点，
function stackCopy(obj){
    let stack=new Stack()
    let ret=toString.call(item)==='[object Array]'?[]:(toString.call(item)==='[object Object]'?{}:null)
    stack.push({object:obj,index:0})
    let item
    let curItem
    while(true){
        let item=stack.pop()
        let oType=getType(item.object)
        switch(oType){
            case 'Object':
                let keys=Object.keys(item.object).sort((a,b)=>a.localeCompare(b))

                
                if(item.index<keys.length){
                    stack.push(item)
                    if(item.storeObj===undefined) curItem=ret
                    else{
                        curItem=
                    }
                    let newItem={object:item.object[keys[item.index]],index:0,parent:curItem}
                } 
        }
    }
    return ret
}
function getType(obj){
	let objType=Object.prototype.toString.call(obj)
    return objType.substring(8,objType.length-1)
}
class Stack{
    constructor(){
        this.datas=[]
    }
    push(item){
        this.datas.push(item)
    }
    pop(){
        if(this.datas.length>0){
            let item=this.datas[this.datas.length-1]
            this.datas.length=this.datas.length-1
            return item
        }
    }
}
let m={"balance":114.56211055213129,"cash":0,"margin_call_ratio":{"eth":-62.978786541053076},"market_value":181.90587155478667,"market_value_detail":{"eth":181.90587155478667},"position":[{"available":0,"available_long":0,"available_short":0,"available_xtc":0,"average_open_price":0,"average_open_price_long":134.471,"average_open_price_short":134.366,"contract":"eth.usd.t","contract_full":"eth.usd.2019-03-15","detail":{"buy_amount":0,"buy_available":0,"buy_price_avg":134.471,"buy_price_cost":134.471,"buy_profit_real":-0.00005963,"contract_id":201903150020041,"contract_type":"this_week","create_date":1552214323000,"exchange":"okef","lever_rate":20,"sell_amount":0,"sell_available":0,"sell_price_avg":134.366,"sell_price_cost":134.366,"sell_profit_real":-0.00005963,"symbol":"eth_usd"},"frozen":0,"frozen_position":0,"frozen_position_long":0,"frozen_position_short":0,"frozen_xtc":0,"liquidation_price":0,"liquidation_price_rate":-1,"market_value":0,"market_value_detail":{"eth":0},"pl":-0.00011926,"realized_settle":0,"realized_settle_long":0,"realized_settle_short":0,"total_amount":0,"total_amount_long":0,"total_amount_short":0,"total_xtc_amount":0,"type":"future","unrealized":0,"unrealized_long":0,"unrealized_long_rate":0,"unrealized_rate":0,"unrealized_settle":0,"unrealized_settle_long":0,"unrealized_settle_short":0,"unrealized_short":0,"unrealized_short_rate":0,"value_cny":0},{"available":0,"available_long":0,"available_short":0,"available_xtc":0,"average_open_price":0,"average_open_price_long":0,"average_open_price_short":0,"contract":"eth.usd.n","contract_full":"","detail":{"exchange":"okef"},"frozen":0,"frozen_position":0,"frozen_position_long":0,"frozen_position_short":0,"frozen_xtc":0,"liquidation_price":0,"liquidation_price_rate":0,"market_value":0,"market_value_detail":{"eth":0},"pl":0,"realized_settle":0,"realized_settle_long":0,"realized_settle_short":0,"total_amount":0,"total_amount_long":0,"total_amount_short":0,"total_xtc_amount":0,"type":"future","unrealized":0,"unrealized_long":0,"unrealized_long_rate":0,"unrealized_rate":0,"unrealized_settle":0,"unrealized_settle_long":0,"unrealized_settle_short":0,"unrealized_short":0,"unrealized_short_rate":0,"value_cny":0},{"available":1,"available_long":1,"available_short":0,"available_xtc":0.07508832263950471,"average_open_price":100,"average_open_price_long":100,"average_open_price_short":0,"contract":"eth.usd.q","contract_full":"eth.usd.2019-03-29","detail":{"buy_amount":1,"buy_available":1,"buy_price_avg":100,"buy_price_cost":136.04,"buy_profit_real":0,"contract_id":201903290020060,"contract_type":"quarter","create_date":1546490438000,"exchange":"okef","lever_rate":20,"sell_amount":0,"sell_available":0,"sell_price_avg":0,"sell_price_cost":0,"sell_profit_real":0,"symbol":"eth_usd"},"frozen":0,"frozen_position":0.0037544161319752354,"frozen_position_long":0.0037544161319752354,"frozen_position_short":0,"frozen_xtc":0,"liquidation_price":49.803,"liquidation_price_rate":-0.6260376267584746,"market_value":67.34376100265538,"market_value_detail":{"eth":67.34376100265538},"pl":0,"realized_settle":0.026492208174066452,"realized_settle_long":0.026492208174066452,"realized_settle_short":0,"total_amount":1,"total_amount_long":1,"total_amount_short":0,"total_xtc_amount":0.07508832263950471,"type":"future","unrealized":0.024911677360495287,"unrealized_long":0.024911677360495287,"unrealized_long_rate":4.982335472099058,"unrealized_rate":4.982335472099058,"unrealized_settle":-0.0015805308135711637,"unrealized_settle_long":-0.0015805308135711637,"unrealized_settle_short":0,"unrealized_short":0,"unrealized_short_rate":0,"value_cny":67.34376100265538},{"available":0.124039337,"contract":"eth","detail":{"account_rights":0.12779357,"bond_type":1,"keep_deposit":0.003754233,"profit_real":-0.00011926,"profit_unreal":-0.00157687,"risk_rate":34.0399},"frozen":0.003754233,"frozen_order":0,"frozen_position":0.007508832263950471,"margin_level":34.0399,"market_value":114.56211055213129,"realized_profit":-0.00011926,"total_amount":0.12779357,"type":"future-spot","unrealized_profit":0.024911677360495287,"value_cny":114.56211055213129}]}
// let jsonStart=new Date().getTime()
// for(let i=0;i<100000;i++){
//     JSON.parse(JSON.stringify(m))
// }
// let jsonEnd=new Date().getTime()
// console.log('100000 copy, json took',jsonEnd-jsonStart,'ms')
// let scpStart=new Date().getTime()
// for(let i=0;i<100000;i++){
//     simpleCopy(m)
// }
// let scpEnd=new Date().getTime()
// console.log('100000 copy, simpleCopy took',scpEnd-scpStart,'ms')
console.log(m,simpleCopy(m))