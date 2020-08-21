import { ipcMain as ipc } from 'electron'
import SettingsManager from './settings';

export default class TaskManager extends SettingsManager {
  constructor(brisque) {
    super(brisque, 'tasks');
    
    ipc.on('task.import', super.filteredEvent(this.importTasks))
    ipc.on('task.archive', super.filteredEvent(this.archiveTasks))
    ipc.on('task.delete', super.filteredEvent(this.deleteTasks))
    ipc.on('task.start', super.filteredEvent(this.startTasks))
    ipc.on('task.stop', super.filteredEvent(this.stopTasks))
  }
  
  importTasks = tasks => Array.isArray(tasks) && this.insert(tasks).catch(console.error)
  archiveTasks = ids => this.update(ids.length > 0 ? { _id: { $in: ids } } : {}, { $set: { status: 'ARCHIVED', archived: true }}, { multi: true }).catch(console.error)
  deleteTasks = ids => this.remove(ids.length > 0 ? { _id: { $in: ids } } : {}, { multi: true }).catch(console.error)
  startTasks = ids => this.update(ids.length > 0 ? { _id: { $in: ids } } : {}, { $set: { status: 'STARTED' } }, { multi: true})
  stopTasks = ids => this.update(ids.length > 0 ? { _id: { $in: ids } } : {}, { $set: { status: 'IDLE' } }, { multi: true})
}
