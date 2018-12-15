import axios from '@/services/axios'
const state = {
  auth_error: {},
  token: <string> window.localStorage.getItem('auth-token') || '',
  url: <string> window.localStorage.getItem('url') || '',
  email: <string> window.localStorage.getItem('email') || '',
  user: {}
}

const mutations = {
  loginSuccess (state, token: string) {
    state.auth_error = {}
    state.token = token
    localStorage.setItem('auth-token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },

  logout (state) {
    state.token = null
    localStorage.removeItem('auth-token')
    delete axios.defaults.headers.common['Authorization']
  },

  setUser (state, { currentUser }) {
    state.user = currentUser
  },

  setUrl (state, url: string) {
    state.url = url
    localStorage.setItem('url', url)
  },

  setMail (state, email: string) {
    state.email = email
    localStorage.setItem('email', email)
  }
}

const actions = {
  login ({ commit, state }, { email, password }) {

    return new Promise((resolve, reject) => {
      axios
        .post(state.url + '/api/me', { email, password })
        .then(resp => {
          commit('setMail', email)
          commit('loginSuccess', resp.data.token)
          resolve(resp)
        })
        .catch(err => {
          commit('logoutSuccess')
          reject(err)
        })
    })
  },

  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      return axios
        .delete(state.url + '/api/me')
        .then(resp => {
          commit('logout')
          resolve()
        })
        .catch(error => reject(error))
    })
  },

  setMail ({ commit }, mail: string) {
    commit('setMail', mail)
  },

  setUrl ({ commit }, url: string) {
    commit('setUrl', url)
  }
}

const getters = {
  isAuthenticated: state => !!state.token,
  user: state => state.user,
  url: state => state.url.replace(/\/+$/, ''),
  email: state => state.email,
  token: state => state.token
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
