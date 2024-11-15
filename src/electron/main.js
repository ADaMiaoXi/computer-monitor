const { BrowserWindow, Tray, Menu, app, ipcMain, screen } = require("electron");
const path = require("node:path");
const apis = require("./apis");

const createApplication = () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const win = new BrowserWindow({
        x: Math.floor(width * 0.65),
        y: Math.floor(height * 0.35),
        width: 0,
        height: 600,
        frame: false,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    win.loadFile(path.join(__dirname, "../render/html/index.html"));

    // Initialize tray menu
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Open DevTools",
            click: () => {
                win.webContents.toggleDevTools();
            },
        },
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

    appTray.on("double-click", () => {
        if (win.isVisible()) {
            win.webContents.send("stopApp");
            win.hide();
        } else {
            win.webContents.send("runApp");
            win.show();
        }
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
