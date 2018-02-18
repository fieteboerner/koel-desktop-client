import { each, find, findIndex } from 'lodash'

const state = {
  context: null,
  contextActive: false,
  queue: [],
  current: {}
}

const mutations = {
  QUEUE_SET (state, { songlist, toPlay }) {
    state.queue = songlist.map(song => {
      let id = Math.random()
        .toString(36)
        .substr(2, 16)

      return { id, song, prio: false }
    })

    each(state.queue, item => {
      if (item.song === toPlay) {
        state.current = item
        return false
      }
    })
  },
  QUEUE_SONG_START (state) {
    let current = state.current
    current.play_start = new Date()
    state.current = current
  },
  QUEUE_SONG_END (state) {
    let current = state.current
    delete current.play_start
    state.current = current
  },
  QUEUE_SET_CURRENT (state, current) {
    state.current = current
  }
}

const actions = {
  set ({ commit }, { songlist, toPlay, context }) {
    commit('QUEUE_SET', { songlist, toPlay })
  },
  queue ({ state }, { songs }) {
    // add after current with true prio
  },
  skip ({ commit, dispatch, getters }) {
    if (!getters.next) return
    commit('QUEUE_SET_CURRENT', getters.next)

    dispatch('start')
  },
  back ({ commit, dispatch, getters }) {
    if (!getters.previous) return
    commit('QUEUE_SET_CURRENT', getters.previous)

    dispatch('start')
  },
  start ({ commit }) {
    commit('QUEUE_SONG_START')
  },
  end ({ commit }) {
    commit('QUEUE_SONG_END')
  }
}

const getters = {
  context: state => (state.contextActive ? state.context : null),
  currentPlaybackItem: state => state.current,
  currentSong: state => (find(state.queue, item => item === state.current) || {}).song,
  next: state => {
    // handle repeat / shuffle
    let currentIndex = findIndex(
      state.queue,
      item => item.id === state.current.id
    )
    if (!state.queue[++currentIndex]) return false
    return state.queue[currentIndex]
  },
  previous: state => {
    // handle repeat / shuffle
    let currentIndex = findIndex(
      state.queue,
      item => item.id === state.current.id
    )
    if (!state.queue[--currentIndex]) return false
    return state.queue[currentIndex]
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
