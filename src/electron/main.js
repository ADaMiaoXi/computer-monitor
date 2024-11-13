const { app, BrowserWindow, Tray, Menu, ipcMain } = require("electron");
const path = require("node:path");
const apis = require("./apis");

const createApplication = () => {
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

    win.loadFile(path.join(__dirname, "../render/html/index.html"));

    // Initialize tray menu
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Exit",
            click: () => {
                app.quit();
            },
        },
    ]);

    let iconPath = path.join(__dirname, "../../static/icons/logo.ico");
    let appTray = new Tray(iconPath);
    appTray.setToolTip("Monitor");
    appTray.setContextMenu(contextMenu);

    appTray.on("click", () => {
        win.isVisible(0) ? win.hide() : win.show();
    });
};

const initializeElectronApis = () => {
    Object.keys(apis).forEach((apiName) => {
        ipcMain.handle(apiName, apis[apiName]);
    });
};

app.whenReady().then(() => {
    initializeElectronApis();
    createApplication();
});
