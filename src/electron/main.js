const {BrowserWindow, Tray, Menu, app, ipcMain} = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const {throttle} = require('lodash')
const apis = require('./apis')
const {getCustomizedData, saveCustomizedData} = require('./apis/commonApis')
const createApplication = () => {
    const {position} = getCustomizedData()
    const win = new BrowserWindow({
        x: position.x,
        y: position.y,
        width: 100,
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

    // Save position if window moved
    const savePosition = throttle(
        () => {
            const customizedData = getCustomizedData()
            const [x, y] = win.getPosition()
            customizedData.position.x = x
            customizedData.position.y = y
            saveCustomizedData(undefined, customizedData)
        },
        1500,
        {leading: false}
    )

    win.loadFile(path.join(__dirname, '../render/html/index.html'))

    win.on('move', savePosition)

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

const initializeUserData = () => {
    const userDataPath = path.resolve(app.getPath('userData'), 'userData')
    if (!fs.existsSync(userDataPath)) {
        const {customizedData} = require(path.resolve(__dirname, '../configTemplate/index.js'))
        fs.mkdirSync(userDataPath)
        fs.writeFileSync(path.resolve(userDataPath, 'customizedData.json'), JSON.stringify(customizedData), 'utf8')
    }
}

app.whenReady().then(() => {
    initializeUserData()
    initializeElectronApis()
    createApplication()
})
