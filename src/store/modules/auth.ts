import axios from '@/services/axios'
import StorageService from '@/services/storage'
import { AuthState, RootState } from '../types';
import { GetterTree, MutationTree, ActionTree, Module } from 'vuex';

const state: AuthState = {
  token: StorageService.get('authToken', ''),
  url: StorageService.get('url', ''),
  email: StorageService.get('email', ''),
  user: {}
}

const mutations: MutationTree<AuthState> = {
  loginSuccess (state, token: string) {
    state.token = token
    StorageService.set('authToken', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },

  logout (state) {
    state.token = null
    StorageService.remove('authToken')
    StorageService.setUserPrefix('')
    delete axios.defaults.headers.common['Authorization']
  },

  setUser (state, { currentUser }) {
    state.user = currentUser
    StorageService.setUserPrefix(currentUser.email, currentUser.id.toString())
  },

  setUrl (state, url: string) {
    state.url = url
    StorageService.set('url', url)
  },

  setMail (state, email: string) {
    state.email = email
    StorageService.set('email', email)
  }
}

const actions: ActionTree<AuthState, RootState> = {
  login ({ commit, state }, { email, password }) {

    return new Promise((resolve, reject) => {
      axios
        .post(state.url + '/api/me', { email, password })
        .then(resp => {
          commit('setMail', email)
          commit('loginSuccess', resp.data.token)
          StorageService.setUserPrefix(email)
          resolve(resp)
        })
        .catch(err => {
          commit('logout')
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

const getters: GetterTree<AuthState, RootState> = {
  isAuthenticated: state => !!state.token,
  user: state => state.user,
  url: state => state.url.replace(/\/+$/, ''),
  email: state => state.email,
  token: state => state.token
}

const AuthModule: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export default AuthModule