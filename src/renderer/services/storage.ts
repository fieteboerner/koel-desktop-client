class StorageService {
    storage?: Storage = null
    prefix: string = ''

    constructor(storage: Storage, prefix: string = '') {
        this.storage = storage
        this.prefix = prefix
    }

    set(key: string, value: string) {
        this.storage.setItem(this._prefixKey(key), value)
    }

    get(key: string, defaultValue: string = null): string {
        return this.storage.getItem(this._prefixKey(key)) || defaultValue
    }

    setToken(token: string) {
        this.set('token', token)
    }

    setLastUrl(url: string) {
        this.set('lastUrl', url)
    }

    getLastUrl(): string {
        return this.get('lastUrl') || '/'
    }

    _prefixKey(key: string) {
        const prefix = this.prefix ? `${this.prefix}.` : ''
        return `${prefix}${key}`
    }
}

export default new StorageService(window.localStorage)