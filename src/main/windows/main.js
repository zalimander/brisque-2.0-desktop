import { ipcMain as ipc } from 'electron'

export default class MainWindow {
  static startHash = '/app/dashboard';

  constructor(brisque) {
    this.brisque = brisque;
  }

  open() {
    return new Promise((resolve, reject) => {
      const {
        userManager,
        windowManager,
        windowManager: { window }
      } = this.brisque

      const closed = () => {
        reject();
      };

      window.once('closed', closed);
      
      ipc.once('logout', () => {
        window.removeListener('closed', closed)
        resolve('logout')
      })
      
      windowManager
        .resize('main')
        .then(visible => {
          if (visible) {
            window.webContents.send('hash', MainWindow.startHash);
          } else {
            window.loadURL(`${process.env.WIN_URL}#${MainWindow.startHash}`);
          }
          return visible;
        })
        .catch(() => {});
    });
  }
}
