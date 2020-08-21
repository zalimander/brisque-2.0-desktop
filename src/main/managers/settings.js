import { app, dialog, ipcMain as ipc } from 'electron'
import Datastore from 'nedb'
import path from 'path'
import promisify from 'util.promisify-all'

export default class SettingsManager extends Datastore {
  
  constructor(brisque, type, name = type.substring(0, 1).toUpperCase() + type.substring(1).toLowerCase()) {
    super({
      filename: path.resolve(app.getPath('userData'), 'Settings', type)
    })
    this.promised = promisify(Datastore.prototype)
    this.brisque = brisque
    this.type = type
    this.name = name
    super.loadDatabase(err => {
      if (err) {
        return dialog.showMessageBox(
          {
            type: 'error',
            title: `${name} Load Failure`,
            message: `There was a problem loading your ${type}. Try restarting Brisque, and contact us on Discord if the problem persists.${
              err ? `\n\n${err}` : ''
              }`,
            buttons: ['Close Brisque']
          },
          () => app.quit()
        )
      }
      
      this.persistence.setAutocompactionInterval(15000)
    });
    
    ['find', 'findOne', 'count'].forEach(property =>
      Object.defineProperty(this, property, {
        value: (...args) => this.promised[property].apply(this, args)
      })
    );
    
    ['update', 'insert', 'remove'].forEach(property =>
      Object.defineProperty(this, property, {
        value: (...args) => this.promised[property].apply(this, args).then(doc => {
          this.latestUpdate = Date.now()
          return doc
        })
      })
    )
    
    ipc.on('store.subscribe', async (evt) => {
      const { windowManager: { window } } = this.brisque
      
      if (window.webContents.id !== evt.sender.id) {
        return
      }
      
      const update = async () => {
        if (!window) {
          return
        }
        
        if (this.latestUpdate && (this.lastUpdate || 0) < this.latestUpdate && window) {
          window.webContents.send('store.update', {
            type,
            data: type === 'account' ? await this.findOne({}) : await this.find({})
          })
          this.lastUpdate = Date.now()
        }
        
        if (timeoutId !== null) {
          timeoutId = setTimeout(update, 50)
        }
      }
      
      let timeoutId = setTimeout(update, 50)
      
      evt.sender.once('closed', () => {
        clearTimeout(timeoutId)
        timeoutId = null
        this.subscription = null
      })
      evt.sender.send('store.update', {
        type,
        data: type === 'account' ? await this.findOne({}) : await this.find({})
      })
    })
  }
  
  parseCsv(csv) {
    return csv.split('\n').reduce((arr, line) => arr.concat(line.split(',')), []).filter(v => v)
  }
  
  filteredEvent(handler) {
    return ({ sender }, data) => {
      const { windowManager: { window: { webContents } } } = this.brisque
      if (sender.id === webContents.id) {
        handler(data)
      }
    }
  }
  
}
