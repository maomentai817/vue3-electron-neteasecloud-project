const { app, BrowserWindow, ipcMain } = require('electron')
const log = require('electron-log')
const path = require('path')

log.transports.file.level = 'debug'
log.transports.file.file = `${__dirname}/log.txt`

// 记录日志
// log.info('This is an info log message')
// log.warn('This is a warning log message')
// log.error('This is an error log message')

class Main {
  constructor() {
    this.win = null // 初始化 win 为 null
    this.init()
  }

  init() {
    this.onProcess()
  }

  onProcess() {
    app.whenReady().then(() => {
      this.createWindow()
      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow()
        }
      })
    })

    app.on('window-all-closed', () => {
      // 如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    process.on('uncaughtException', (error) => {
      // 处理错误
      log.error('Uncaught Exception:', error)
      // 可以选择退出应用程序
      process.exit(1)
    })
  }

  createWindow() {
    this.win = new BrowserWindow({
      minHeight: 750,
      minWidth: 1150,
      height: 750,
      width: 1150,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        preload: path.join(__dirname, './preload.cjs')
      },
      frame: false
    })

    if (app.isPackaged) {
      this.win.loadFile(path.join(__dirname, '../dist/index.html')) // 指向打包后的 HTML 文件
    } else {
      // const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
      const url = 'http://localhost:5173'
      // console.log(url)
      this.win.loadURL(url) // 指向开发服务器
    }

    this.ipcWindowEvent()
    this.win.webContents.openDevTools()
  }

  ipcWindowEvent() {
    ipcMain.on('maximize', () => {
      this.win.maximize()
    })

    ipcMain.on('unmaximize', () => {
      this.win.unmaximize()
    })

    ipcMain.on('minimize', () => {
      this.win.minimize()
    })

    ipcMain.on('restore', () => {
      this.win.restore()
    })

    ipcMain.on('close', () => {
      this.win.close()
    })

    ipcMain.on('reset', () => {
      app.exit() // 退出当前程序
      app.relaunch() // 重新启动
    })

    ipcMain.on('getUserDataPath', (event) => {
      const userDataPath = app.getPath('userData')
      event.sender.send('user-data-path', userDataPath)
    })
  }
}

new Main()
