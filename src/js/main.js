const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const {
    getStaticInfo,
    getDynamicInfo,
    getHTMLSnippets,
    getHTMLSnippetsNameById,
    resizeWindow,
    moveWindow,
    getRAMDashboardHtml,
    killTaskByName,
    setIgnoreMouseEvents
} = require("./monitorUtils");

const createWindow = () => {
    const win = new BrowserWindow({
        x: 100,
        y: 200,
        width: 0,
        height: 400,
        frame: false,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    win.webContents.toggleDevTools();

    win.loadFile(path.join(__dirname, "../html/index.html"));
};

const prepareApis = () => {
    ipcMain.handle("getDynamicInfo", getDynamicInfo);
    ipcMain.handle("getStaticInfo", getStaticInfo);
    ipcMain.handle("getHTMLSnippets", getHTMLSnippets);
    ipcMain.handle("getHTMLSnippetsNameById", getHTMLSnippetsNameById);
    ipcMain.handle("resizeWindow", resizeWindow);
    ipcMain.handle("getRAMDashboardHtml", getRAMDashboardHtml);
    ipcMain.handle("moveWindow", moveWindow);
    ipcMain.handle("killTaskByName", killTaskByName);
    ipcMain.handle("setIgnoreMouseEvents", setIgnoreMouseEvents);
};

app.whenReady().then(() => {
    prepareApis();
    createWindow();
});
