// import { ipcMain as ipc } from 'electron'

export default class PurchaseWindow {
  static open(windowManager) {
    return new Promise(resolve => {
      const window = windowManager && windowManager.window;

      const closed = () => {
        resolve();
      };

      window.once('closed', closed);

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
