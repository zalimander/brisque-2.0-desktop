import { BrowserWindow, ipcMain as ipc } from 'electron'
import MenuBuilder from '../menu'

export default class WindowManager {
  static dimensions = {
    login: {
      width: 450,
      height: 350
    },
    discord: {
      width: 550,
      height: 750
    },
    main: {
      resizable: true,
      maximizable: true,
      width: 1200,
      height: 720,
      minimum: {
        width: 1100,
        height: 760
      }
    },
    captcha: {
      width: 420,
      height: 789
    }
  }
  
  constructor(dimension) {
    this.window = new BrowserWindow({
      resizable: false,
      maximizable: false,
      ...WindowManager.dimensions[dimension],
      show: false,
      titleBarStyle: 'hiddenInset',
      backgroundColor: '#00000000',
      vibrancy: 'dark',
      frame: process.platform === 'darwin',
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        devTools: true
      }
    })
    
    const menuBuilder = new MenuBuilder(this.window)
    menuBuilder.buildMenu()
    
    this.window.once('ready-to-show', () => {
      this.window.show()
      this.window.openDevTools()
    })
    
    this.window.once('closed', () => {
      this.window = null
      ipc.removeListener('resize', this.resize)
    })
    
    this.window.on('resize', () => this.window.webContents.send('resize'))
    this.window.on('enter-full-screen', () => this.window.webContents.send('enter-full-screen'))
    this.window.on('leave-full-screen', () => this.window.webContents.send('leave-full-screen'))
    
    ipc.on('resize', this.resize)
  }
  
  resize = (evt, dimen) => {
    const event = typeof evt === 'string' ? undefined : evt
    const dimension = event === undefined ? evt : dimen
    if (event && event.sender.id !== this.window.webContents.id) {
      return
    }
    
    return new Promise(resolve => {
      const { x, y, width, height } = this.window.getBounds()
      const bounds = WindowManager.dimensions[dimension]
      const minimum = bounds.minimum || bounds
      const visible = this.window.isVisible()
      this.window.setResizable(!!bounds.resizable)
      this.window.setMaximizable(!!bounds.maximizable)
      this.window.setMinimumSize(minimum.width, minimum.height)
      if (width === bounds.width && height === bounds.height) {
        return resolve(visible)
      }
      if (visible) {
        this.window.once('resize', () => resolve(visible))
      }
      this.window.setBounds(
        {
          x: Math.round(x - (bounds.width - width) / 2),
          y: Math.round(y - (bounds.height - height) / 2),
          width: bounds.width,
          height: bounds.height
        },
        visible
      )
      
      if (!visible) {
        return resolve(visible)
      }
    })
  }
}
