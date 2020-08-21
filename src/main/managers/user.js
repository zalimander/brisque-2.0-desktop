import { session, ipcMain as ipc } from 'electron';
import axios from 'axios';
import SettingsManager from './settings';

export default class UserManager extends SettingsManager {
  constructor(brisque) {
    super(brisque, 'account');
    ipc.on('user.update', async (event, user) => {
      console.log('user.update', user)
      await this.update({}, user)
      console.log(await this.getUser())
    })
  }

  logout() {
    session.fromPartition('persist:discord').clearStorageData();
    this.remove({}, { multi: true });
  }
  
  getUser = () => this.findOne({}).then(user => this.user = user);
  getToken = () => this.getUser().then(user => user && user.token)

  async fetchUser(tok = this.getToken(), refreshed) {
    const token = tok instanceof Promise ? await tok : decodeURIComponent(tok)
    if (!token) {
      return
    }
    
    axios.defaults.headers.authorization = `JWT ${ token }`;
  
    this.token = token;
    try {
      const { data } = await axios.get('/api/user');
  
      this.user = Object.assign(data, { token })
      await this.update({}, this.user, {
        upsert: true
      });
    } catch (e) {
      if (refreshed) {
        throw e
      }
      
      const { data } = await axios.get(`/api/authenticate/${ token }/refresh`)
      
      return this.fetchUser(data.token, true)
    }
  
    return this.user;
  }

}
