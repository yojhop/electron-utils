import * as responsibleIpcRenderer from './resposibleIpcRenderer'
import * as responsibleIpcMain from './resposibleIpcMain'
const RANDOMKEY = '1TOKENT0SLDFNEIO'
responsibleIpcRenderer.setRandomKey(RANDOMKEY)
responsibleIpcMain.setRandomKey(RANDOMKEY)
export { responsibleIpcMain, responsibleIpcRenderer }
