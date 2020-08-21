import { ipcMain as ipc, dialog } from 'electron'
import crypto from 'crypto'
import SettingsManager from './settings';

export default class ProxyManager extends SettingsManager {
  constructor(brisque) {
    super(brisque, 'proxies', 'Proxy')
    
    ipc.on('proxy.import', super.filteredEvent(this.importProxies))
    ipc.on('proxy.delete', super.filteredEvent(this.deleteProxies))
  }
  
  importProxies = async data => {
    const { windowManager } = this.brisque
    const filterUnique = async proxies => (await Promise.all(proxies.map(async proxy => {
      if (await this.count(proxy) === 0) {
        return Object.assign(proxy, { _id: crypto.randomBytes(16).toString('hex') })
      }
    }))).filter(v => v)
    
    let unique
    if (typeof data === 'string') {
      const parsed = super.parseCsv(data).filter(v => v.indexOf(':') !== -1).map(proxy => proxy.split(':'))
      unique = await filterUnique(parsed.map(line => ({ ip: line[0], port: line[1], user: line[2], pass: line[3] })))
    } else if (Array.isArray(data)) {
      unique = await filterUnique(data)
    }
  
    if (unique && unique.length > 0) {
      return this.insert(unique).catch(err => dialog.showMessageBox(windowManager.window, {
        type: 'error',
        title: 'Uh Oh!',
        message: `There was a problem importing your proxies, please try again!${ err ? `\n\n${ err }` : '' }`,
        buttons: ['Okay'],
        defaultId: 0,
      }))
    }
  }
  
  deleteProxies = ids => this.remove(ids.length > 0 ? { _id: { $in: ids } } : {}, { multi: true }).catch(console.error)
  
}
