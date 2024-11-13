const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronApi", {
    invoke: (apiName, params) => ipcRenderer.invoke(apiName, params),
});
