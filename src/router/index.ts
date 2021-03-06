import Vue from 'vue'
import Router from 'vue-router'
import { ifAuthenticated, ifNotAuthenticated } from './guards'
import StorageService from '@/services/storage'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: require('@/views/Login.vue').default,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/',
      component: require('@/views/Main.vue').default,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: '',
          name: 'koel',
          redirect: '/artists'
        },
        {
          path: '/albums/:id?',
          name: 'albums',
          component: require('@/views/main/Albums.vue').default,
          beforeEnter: ifAuthenticated
        },
        {
          path: '/artists/:id?',
          name: 'artists',
          component: require('@/views/main/Artists.vue').default,
          beforeEnter: ifAuthenticated
        },
        {
          path: '/playlists/:id?',
          name: 'playlists',
          component: require('@/views/main/Playlists.vue').default,
          beforeEnter: ifAuthenticated
        },
        {
          path: '/songs',
          name: 'songs',
          component: require('@/views/main/Songs.vue').default,
          beforeEnter: ifAuthenticated
        },
      ]
    },
    {
      path: '*',
      redirect: '/artists'
    }
  ]
})

router.afterEach(to => {
  StorageService.setLastUrl(to.fullPath)
})

export default router
