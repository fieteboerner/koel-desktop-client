import Vue from 'vue'
import Router from 'vue-router'
import { ifAuthenticated, ifNotAuthenticated } from './guards'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: require('@/components/Login.vue').default,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/',
      name: 'koel',
      component: require('@/components/Main.vue').default,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: '/albums',
          name: 'albums',
          component: require('@/components/views/Albums.vue').default,
          beforeEnter: ifAuthenticated
        },
        {
          path: '/artists/:id?',
          name: 'artists',
          component: require('@/components/views/Artists.vue').default,
          beforeEnter: ifAuthenticated
        },
        {
          path: '/playlists',
          name: 'playlists',
          component: require('@/components/views/Artists.vue').default,
          beforeEnter: ifAuthenticated
        },
        {
          path: '/songs',
          name: 'songs',
          component: require('@/components/views/Artists.vue').default,
          beforeEnter: ifAuthenticated
        }
      ]
    },
    {
      path: '*',
      redirect: '/artists'
    }
  ]
})
