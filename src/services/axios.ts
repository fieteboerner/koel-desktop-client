import axios from 'axios'
import store from '../store/index'
import router from '../router/index'

const client = axios.create()
client.interceptors.response.use(
  null,
  async (error) => {
    if (error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
      // if you ever get an unauthorized, logout the user
      await store.dispatch('auth/logout')
      router.push('/login')
      return
    }
    throw error
  }
)

export default client
