import { sha256 } from 'js-sha256'
class StorageService {
    storage?: Storage = null
    userPrefix: string = ''

    constructor(storage: Storage) {
      this.storage = storage
      this.userPrefix = this.get('userPrefix', '')
    }

    set(key: string, value: string, prefix: string = '') {
      this.storage.setItem(this._prefixKey(prefix, key), value)
    }

    get(key: string, defaultValue: string = null, prefix: string = ''): string {
      return this.storage.getItem(this._prefixKey(prefix, key)) || defaultValue
    }

    remove(key: string, prefix: string = '') {
      this.storage.removeItem(this._prefixKey(prefix, key))
    }

    setUserValue(key: string, value: string) {
      if(!this.userPrefix) {
        return
      }

      this.set(key, value, this.userPrefix)
    }

    getUserValue(key: string, defaultValue: string = null) {
      if(!this.userPrefix) {
        return defaultValue
      }

      return this.get(key, defaultValue, this.userPrefix)
    }

    removeUserValue(key: string) {
      this.remove(key, this.userPrefix)
    }

    setUserPrefix(email: string, id: string = '') {
      const userMap = JSON.parse(this.get('userMap', '{}'))
      const emailHash = sha256(email)
      if (id) {
        userMap[emailHash] = id
        this.set('userMap', JSON.stringify(userMap))
      } else {
        id = userMap[emailHash] || ''
      }
      this.userPrefix = id
      this.set('userPrefix', id)
    }

    setToken(token: string) {
      this.set('token', token)
    }

    setLastUrl(url: string) {
      this.setUserValue('lastUrl', url)
    }

    getLastUrl(): string {
      return this.getUserValue('lastUrl') || '/'
    }

    _prefixKey(prefix: string, key: string) {
      prefix = prefix ? `user_${prefix}.` : ''
      return `${prefix}${key}`
    }
}

export default new StorageService(window.localStorage)