import store from '@/store'

const ifAuthenticated = (from, to, next) => {
  if (store.getters['auth/url'] && store.getters['auth/isAuthenticated']) {
    next()
    return
  }

  next('/login')
}

const ifNotAuthenticated = (from, to, next) => {
  if (!store.getters['auth/url'] || !store.getters['auth/isAuthenticated']) {
    next()
    return
  }

  next('/')
}

export { ifAuthenticated, ifNotAuthenticated }
