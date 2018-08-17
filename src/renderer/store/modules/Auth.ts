import axios from '../../api/axios'
const state = {
  auth_error: {},
  token: window.localStorage.getItem('auth-token') || '',
  url: window.localStorage.getItem('url') || '',
  user: {}
}

const mutations = {
  AUTH_SUCCESS (state, token) {
    state.auth_error = {}
    state.token = token
    localStorage.setItem('auth-token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
  AUTH_LOGOUT (state) {
    state.token = null
    localStorage.removeItem('auth-token')
    delete axios.defaults.headers.common['Authorization']
  },
  AUTH_USER (state, { currentUser }) {
    state.user = currentUser
  },
  AUTH_SET_URL (state, url) {
    state.url = url
    localStorage.setItem('url', url)
  }
}

const actions = {
  AUTH_REQUEST ({ commit, dispatch, state }, { email, password }) {
    return new Promise((resolve, reject) => {
      axios
        .post(state.url + '/api/me', { email, password })
        .then(resp => {
          commit('AUTH_SUCCESS', resp.data.token)
          dispatch('DATA_REQUEST')
          resolve(resp)
        })
        .catch(err => {
          commit('AUTH_LOGOUT')
          reject(err)
        })
    })
  },
  AUTH_LOGOUT ({ commit, state }) {
    return new Promise((resolve, reject) => {
      return axios
        .delete(state.url + '/api/me')
        .then(resp => {
          commit('AUTH_LOGOUT')
          resolve()
        })
        .catch(error => reject(error))
    })
  },
  AUTH_SET_URL ({ commit }, url) {
    commit('AUTH_SET_URL', url)
  }
}

const getters = {
  isAuthenticated: state => !!state.token,
  user: state => state.user,
  url: state => state.url.replace(/\/+$/, ''),
  token: state => state.token
}

export default {
  state,
  mutations,
  actions,
  getters
}
