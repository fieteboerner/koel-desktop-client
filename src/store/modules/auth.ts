import axios from '@/services/axios'
import StorageService from '@/services/storage'
import { AuthState, RootState } from '../types'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'

const state: AuthState = {
  loading: false,
  token: StorageService.get('authToken', ''),
  url: StorageService.get('url', ''),
  email: StorageService.get('email', ''),
  user: {}
}

const mutations: MutationTree<AuthState> = {
  setLoading(state, loading: boolean) {
    state.loading = loading
  },
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
  async login ({ commit, state }, { email, password }) {
    try{
      commit('setLoading', true)
      const { data } = await axios.post(state.url + '/api/me', {
        email,
        password
      })
      commit('setMail', email)
      commit('loginSuccess', data.token)
      StorageService.setUserPrefix(email)
    } catch (error) {
      commit('logout')
      throw error
    } finally {
      commit('setLoading', false)
    }
  },

  async logout ({ commit, state }) {
    await axios.delete(state.url + '/api/me')
    commit('logout')
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
  isLoading: state => state.loading,
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
