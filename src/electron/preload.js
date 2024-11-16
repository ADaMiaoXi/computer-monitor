const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: (apiName, params) => ipcRenderer.invoke(apiName, params),
    listen: (eventName, callback) => ipcRenderer.on(eventName, (event, data) => callback(data))
})
