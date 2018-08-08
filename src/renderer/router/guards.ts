import store from '@/store'

const ifAuthenticated = (from, to, next) => {
  if (store.getters.url && store.getters.isAuthenticated) {
    next()
    return
  }

  next('/login')
}

const ifNotAuthenticated = (from, to, next) => {
  if (!store.getters.url || !store.getters.isAuthenticated) {
    next()
    return
  }

  next('/')
}

export { ifAuthenticated, ifNotAuthenticated }
