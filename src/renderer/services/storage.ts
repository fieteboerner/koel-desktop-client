const StorageService = {
    setLastUrl(url: string) {
        window.localStorage.setItem('lastUrl', url)
    },

    getLastUrl(): string {
        return window.localStorage.getItem('lastUrl') || '/'
    }
}

export default StorageService