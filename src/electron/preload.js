const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronApis", {
    getDynamicInfo: (initializedInfo) =>
        ipcRenderer.invoke("getDynamicInfo", initializedInfo),
    getStaticInfo: () => ipcRenderer.invoke("getStaticInfo"),
    getHTMLSnippets: (snippetName) =>
        ipcRenderer.invoke("getHTMLSnippets", snippetName),
    getHTMLSnippetsNameById: (id) =>
        ipcRenderer.invoke("getHTMLSnippetsNameById", id),
    resizeWindow: (width, height) =>
        ipcRenderer.invoke("resizeWindow", width, height),
    moveWindow: (x, y) => ipcRenderer.invoke("moveWindow", x, y),
    getRAMDashboardHtml: () => ipcRenderer.invoke("getRAMDashboardHtml"),
    killTaskByName: (imageName) =>
        ipcRenderer.invoke("killTaskByName", imageName),
    setIgnoreMouseEvents: (ignore) =>
        ipcRenderer.invoke("setIgnoreMouseEvents", ignore),
    getIconOfProcesses: () =>
        ipcRenderer.invoke("getIconOfProcesses"),
});
