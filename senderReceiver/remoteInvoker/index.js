import { registerInMain, invokeMainFunc } from './mainFuncsInvoker'
import { registerInRenderer, invokeRendererFunc } from './rendererFuncsInvoker'
import { guid } from './uuid'
let target
function setTarget(t) {
  target = t
}
// {id:'',name:'',args:{params:[],winId(optional):''}}
function rendererToTarget(params) {
  params.id = guid.uuid()
  // {name:'',args:[]}
  console.log()
  return invokeMainFunc({ name: 'invokeInRenderer', id: params.id, args: params })
}
function invokeInRenderer(data) {
  console.log('invokeInRenderer data', data)
  let { args, name, id, winId } = data
  // let { params, winId } = args
  if (typeof winId === 'undefined' || winId === null) {
    winId = target
  }
  return invokeRendererFunc({ id, winId, args, name })
}
registerInMain({ 'invokeInRenderer': invokeInRenderer })

export { registerInMain, registerInRenderer, rendererToTarget, setTarget }
