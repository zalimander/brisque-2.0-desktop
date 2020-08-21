import axios from 'axios' // TODO: replace with got
import crypto from 'crypto'

export default class PackageManager {
  constructor(brisque) {
    this.brisque = brisque
    this.userManager = brisque.userManager
    this.packages = []
  }
  
  async fetchPackages(usr) {
    const user = usr || (await this.userManager.getUser())
    this.packages = await Promise.all(
      (user.purchases || []).map(async ({ title, id }) => ({
        title,
        id
      }))
    )
    
    return this.packages
  }
}

function decrypt(data) {
  const buffer = Buffer.from(data, 'hex')
  const decrypted = crypto.publicDecrypt(
    Buffer.from(process.env.PUBLIC_RSA_KEY, 'hex'),
    buffer.slice(16, 528)
  )
  const iv = decrypted.slice(0, 16)
  const key = decrypted.slice(16)
  const encrypted = buffer.slice(528)
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  
  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]).toString('utf8')
}

async function fetchMetadata(id) {
  const { data } = await axios.get(`/api/metadata/${ id }`)
  return JSON.parse(decrypt(data))
}
