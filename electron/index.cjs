const { app, BrowserWindow, ipcMain } = require('electron')
const log = require('electron-log')
const path = require('path')

log.transports.file.level = 'debug'
log.transports.file.file = path.join(__dirname, 'log.txt')

class Main {
  constructor() {
    this.win = null
    this.init()
  }

  // 初始化主进程逻辑
  init() {
    this.setupEventListeners()
  }

  // 设置应用的事件监听器
  setupEventListeners() {
    // 应用准备就绪时
    app
      .whenReady()
      .then(() => {
        this.createWindow()
        // macOS 特性，点击图标时重新打开窗口
        app.on('activate', () => {
          if (BrowserWindow.getAllWindows().length === 0) {
            this.createWindow()
          }
        })
      })
      .catch((err) => log.error('Error during app ready:', err))

    // 所有窗口关闭时
    app.on('window-all-closed', () => {
      // macOS 上除非用户按下 CMD + Q，否则保持应用活跃
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    // 处理未捕获的异常
    process.on('uncaughtException', (error) => {
      log.error('Uncaught Exception:', error)
      process.exit(1) // 在严重错误时退出应用
    })
  }

  // 创建浏览器窗口
  createWindow() {
    try {
      this.win = new BrowserWindow({
        minHeight: 750,
        minWidth: 1150,
        height: 750,
        width: 1150,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
          preload: path.join(__dirname, './preload.js')
        },
        frame: false // 无框窗口，通常用于自定义窗口工具栏
      })

      // 根据开发或打包模式加载页面
      if (app.isPackaged) {
        this.win.loadFile(path.join(__dirname, '../dist/index.html')) // 打包文件
      } else {
        const url = 'http://localhost:5173' // 开发模式下的URL
        this.win.loadURL(url)
      }
      console.log(111)
      this.win.webContents.openDevTools() // 打开开发者工具
      this.setupWindowEventListeners()
    } catch (error) {
      log.error('Error while creating window:', error)
    }
  }

  // 设置窗口相关的事件监听器
  setupWindowEventListeners() {
    ipcMain.on('maximize', () => {
      if (this.win.isMaximizable()) {
        this.win.maximize()
      }
    })

    ipcMain.on('unmaximize', () => {
      if (this.win.isMaximized()) {
        this.win.unmaximize()
      }
    })

    ipcMain.on('minimize', () => {
      if (this.win.isMinimizable()) {
        this.win.minimize()
      }
    })

    ipcMain.on('restore', () => {
      if (!this.win.isMaximized() && !this.win.isFullScreen()) {
        this.win.restore()
      }
    })

    ipcMain.on('close', () => {
      this.win.close()
    })

    ipcMain.on('reset', () => {
      log.info('Application is resetting...')
      app.relaunch() // 重新启动应用
      app.exit() // 退出当前实例
    })

    ipcMain.on('getUserDataPath', (event) => {
      const userDataPath = app.getPath('userData')
      event.sender.send('user-data-path', userDataPath)
    })
  }
}

// 启动应用
new Main()
