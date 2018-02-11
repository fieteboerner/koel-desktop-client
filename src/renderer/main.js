import Vue from 'vue'
import axios from 'axios'
import Buefy from 'buefy'
import InfiniteScroll from 'vue-infinite-scroll'
import 'mdi/css/materialdesignicons.css'

import App from './App'
import router from './router'
import store from './store'

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
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
