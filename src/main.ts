import Vue from 'vue'
import Buefy from 'buefy'
import InfiniteScroll from 'vue-infinite-scroll'
import VueScrollto from 'vue-scrollto'
import 'mdi/css/materialdesignicons.css'

import App from './App.vue'
import router from './router'
import store from './store'

import SingleLayout from './components/layout/Single.vue'
import SidebarLayout from './components/layout/Sidebar.vue'
import StorageService from './services/storage';

const token = store.getters['auth/token']
if (token) {
  store.commit('auth/loginSuccess', token)
  router.replace(StorageService.getLastUrl())
}

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(InfiniteScroll)
Vue.use(VueScrollto)
Vue.component('single-layout', SingleLayout)
Vue.component('sidebar-layout', SidebarLayout)
Vue.filter('timecode', code => {
  let negative = code < 0
  let secNum = Math.abs(parseInt(code, 10))
  let hours = Math.floor(secNum / 3600)
  let minutes = Math.floor((secNum - hours * 3600) / 60)
  let seconds = secNum - hours * 3600 - minutes * 60

  const secondsString = (seconds < 10) ? `0${seconds}` : seconds
  let value = `${minutes}:${secondsString}`
  if (hours > 0) value = `${hours}:${value}`
  if (negative) value = `- ${value}`
  return value
})
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
