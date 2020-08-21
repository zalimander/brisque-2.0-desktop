import { ipcMain as ipc } from 'electron';

export default class LoginWindow {
  constructor(brisque) {
    this.brisque = brisque;
  }
  
  onUser = resolve => this.onUser = (evt, token) => {
    const { userManager, windowManager } = this.brisque;
    const { window } = windowManager;
    
    if (evt.sender.id !== window.webContents.id) {
      return;
    }
  
    userManager
      .fetchUser(token)
      .then(user => {
        //window.webContents.send('user', user);
        window.removeListener('closed', this.onClose);
      
        return resolve();
      })
      .catch(err => {
        window.webContents.send('login')
      });
  }
  
  onClose = reject => this.onClose = () => {
    reject();
    ipc.removeListener('user.token', this.onUser);
  }

  open() {
    return new Promise((resolve, reject) => {
      const { windowManager } = this.brisque;
      const { window } = windowManager;

      window.on('closed', this.onClose(reject));
      ipc.once('user.token', this.onUser(resolve));

      window.setResizable(false);
      windowManager
        .resize('login')
        .then(visible => {
          if (visible) {
            window.webContents.send('hash', '/login');
          } else {
            window.loadURL(`${process.env.WIN_URL}#/login`);
          }
          return visible;
        })
        .catch(() => {});
    });
  }
}
