/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import axios from 'axios';

/**
 * Managers
 */
import WindowManager from './managers/window';
import UserManager from './managers/user';
import TaskManager from './managers/tasks';
import ProfileManager from './managers/profiles'
import ProxyManager from './managers/proxies'
import PackageManager from './managers/package';
import CaptchaManager from './managers/captcha'

/**
 * Windows
 */
import LoginWindow from './windows/login';
import MainWindow from './windows/main';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

process.env.WIN_URL = `file://${__dirname}/../${
  process.env.NODE_ENV === 'development' ? 'renderer' : 'dist'
}/app.html`;
axios.defaults.baseURL = process.env.BASE_URL;

class Brisque {
  
  setup() {
    if (this._setup) {
      return
    }
    
    this._setup = true
    this.userManager = new UserManager(this);
    this.taskManager = new TaskManager(this);
    this.profileManager = new ProfileManager(this);
    this.proxyManager = new ProxyManager(this);
    this.packageManager = new PackageManager(this);
    this.captchaManager = new CaptchaManager(this);
  }
  
  get windowManager() {
    return this._windowManager
  }

  async start() {
    if (this.windowManager) {
      return this.windowManager.window.focus();
    }
    this._windowManager = new WindowManager('login');
    this._windowManager.window.on('close', () => {
      this._windowManager = null
    })
    this.setup()

    try {
      const user = await this.userManager.fetchUser();
      console.log('user', user)
      await this.openWindow(user);
    } catch (e) {
      if (e) {
        console.error(e);
        process.exit(1);
      }
      this._windowManager = null;
    }
  }

  async openWindow(user) {
    if (!user) {
      await (new LoginWindow(this)).open();
    }

    console.log(await this.packageManager.fetchPackages(user));

    switch (await (new MainWindow(this)).open()) {
      case 'logout':
        this.userManager.logout();
        this.windowManager.window.webContents.session.clearStorageData();
        this.windowManager.window.webContents.send('hash', '/login')
        return setTimeout(() => this.openWindow(), 300)
      default:
    }
  }
}

const brisque = new Brisque();

app.on('activate', () => brisque.start());

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  //new AppUpdater();

  return brisque.start();
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
