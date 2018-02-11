import Vue from 'vue'
import axios from 'axios'
import Buefy from 'buefy'
import InfiniteScroll from 'vue-infinite-scroll'
import 'mdi/css/materialdesignicons.css'

import App from './App'
import router from './router'
import store from './store'

import SingleLayout from './components/layout/Single.vue'
import SidebarLayout from './components/layout/Sidebar.vue'

const token = store.getters.token
if (token) {
  store.commit('AUTH_SUCCESS', token)
  store.dispatch('DATA_REQUEST')
}

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(InfiniteScroll)
Vue.component('single-layout', SingleLayout)
Vue.component('sidebar-layout', SidebarLayout)
Vue.filter('timecode', code => {
  let negative = code < 0
  let secNum = Math.abs(parseInt(code, 10))
  let hours = Math.floor(secNum / 3600)
  let minutes = Math.floor((secNum - hours * 3600) / 60)
  let seconds = secNum - hours * 3600 - minutes * 60

  if (seconds < 10) seconds = '0' + seconds
  let value = `${minutes}:${seconds}`
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
