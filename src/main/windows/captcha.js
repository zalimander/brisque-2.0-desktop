import { ipcMain as ipc } from 'electron';

import WindowManager from '../managers/window'

let captchaWindow

export default class CaptchaWindow {
  constructor(brisque) {
    if (captchaWindow) {
      return captchaWindow
    }
    
    this.brisque = brisque;
    captchaWindow = this
  }
  
  open() {
    if (captchaWindow && captchaWindow.windowManager) {
      return captchaWindow.windowManager.window.focus()
    }
    this.windowManager = new WindowManager('captcha')
  
    const { captchaManager } = this.brisque;
    const { window } = this.windowManager;
  
    const closed = () => {
      captchaWindow = null
      ipc.removeListener('captcha.token', onToken);
    };
    
    const onToken = (evt, token) => {
      if (evt.sender.id !== window.webContents.id) {
        return
      }
      
      captchaManager.submit(token)
    }
    
    window.once('closed', closed);
    ipc.on('captcha.token', onToken)
    
    console.log('directing to', `${process.env.WIN_URL}#/captcha`)
    window.loadURL(`${process.env.WIN_URL}#/captcha`);
  }
}
