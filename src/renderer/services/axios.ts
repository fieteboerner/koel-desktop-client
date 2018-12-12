import axios from 'axios'
import store from '../store/index'
import router from '../router/index'

const client = axios.create()
client.interceptors.response.use(
  null,
  (error) => {
    return new Promise(function (resolve, reject) {
      if (error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
        // if you ever get an unauthorized, logout the user
        store.dispatch('AUTH_LOGOUT')
        router.push('/login')
        return
      }
      throw error
    })
  }
)

export default client
