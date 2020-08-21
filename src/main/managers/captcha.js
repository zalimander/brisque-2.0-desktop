import { ipcMain as ipc } from 'electron'

import CaptchaWindow from '../windows/captcha'

export default class CaptchaManager {
  
  constructor(brisque) {
    this.brisque = brisque
    this.userManager = brisque.userManager;
    
    ipc.on('captcha.open', () => (new CaptchaWindow(brisque)).open())
  }
  
}
