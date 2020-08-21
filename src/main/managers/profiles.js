import SettingsManager from './settings';
import { dialog, ipcMain as ipc } from 'electron'

export default class ProfileManager extends SettingsManager {
  constructor(brisque) {
    super(brisque, 'profiles', 'Profile');
  
    ipc.on('profile.import', super.filteredEvent(this.importProfiles))
    ipc.on('profile.delete', super.filteredEvent(this.deleteProfiles))
  }
  
  importProfiles = async data => {
    const { windowManager } = this.brisque
    const filterNew = async profiles => {
      const existing = (await this.find({ _id: { $in: profiles.map(profile => profile._id) } })).map(profile => profile._id)
      return profiles.filter(profile => existing.indexOf(profile._id) === -1)
    }
    
    let unique
    if (Array.isArray(data)) {
      unique = await filterNew(data)
    }
    
    console.log('import profiles', unique, data)
    
    if (unique && unique.length > 0) {
      return this.insert(unique).catch(err => dialog.showMessageBox(windowManager.window, {
        type: 'error',
        title: 'Uh Oh!',
        message: `There was a problem importing your profiles, please try again!${ err ? `\n\n${ err }` : '' }`,
        buttons: ['Okay'],
        defaultId: 0,
      }))
    }
  }
  
  deleteProfiles = ids => this.remove(ids.length > 0 ? { _id: { $in: ids } } : {}, { multi: true }).catch(console.error)
}
