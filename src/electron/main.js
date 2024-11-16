const {BrowserWindow, Tray, Menu, app, ipcMain} = require('electron')
const path = require('node:path')
const apis = require('./apis')
const {
    customizedData: {position}
} = require(path.resolve(__dirname, '../config/index.js'))
const createApplication = () => {
    const win = new BrowserWindow({
        x: position.x,
        y: position.y,
        width: 0,
        height: 600,
        frame: false,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile(path.join(__dirname, '../render/html/index.html'))

    // Initialize tray menu
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open DevTools',
            click: () => {
                win.webContents.toggleDevTools()
            }
        },
        {
            label: 'Exit',
            click: () => {
                app.quit()
            }
        }
    ])

    const iconPath = path.join(__dirname, '../assets/icons/logo.ico')
    const appTray = new Tray(iconPath)
    appTray.setToolTip('Monitor')
    appTray.setContextMenu(contextMenu)

    appTray.on('double-click', () => {
        if (win.isVisible()) {
            win.webContents.send('stopApp')
            win.hide()
        } else {
            win.webContents.send('runApp')
            win.show()
        }
    })
}

const initializeElectronApis = () => {
    Object.keys(apis).forEach(apiName => {
        ipcMain.handle(apiName, apis[apiName])
    })
}

app.whenReady().then(() => {
    initializeElectronApis()
    createApplication()
})
