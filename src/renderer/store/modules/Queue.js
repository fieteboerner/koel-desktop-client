import { clone, each, find, findIndex, findLastIndex, first } from 'lodash'

const state = {
  context: null,
  contextActive: false,
  queue: [],
  history: [],
  current: {}
}

const mutations = {
  QUEUE_SET (state, { songlist, toPlay }) {
    state.queue = songlist.map(song => {
      return { id: generateId(), song, prio: false }
    })

    each(state.queue, item => {
      if (item.song === toPlay) {
        state.current = item
        return false
      }
    })
  },
  QUEUE_REMOVE_FROM_QUEUE (state, item) {
    if (state.current.id === item.id) return

    state.queue = state.queue.filter(i => i.id !== item.id)
  },
  QUEUE_SORT (state, {prio, queueItems}) {
    let queue = []
    if (prio) {
      queue = queueItems.map(queueItem => {
        queueItem.prio = true
        return queueItem
      })
      state.queue
        .filter(song => !song.prio && !queueItems.find(queueItem => queueItem.id === song.id))
        .forEach(song => queue.push(song))
    } else {
      queue = state.queue.filter(song => song.prio && !queueItems.find(queueItem => queueItem.id === song.id))
      queueItems.forEach(queueItem => {
        queueItem.prio = false
        queue.push(queueItem)
      })
    }
    state.queue = clone(queue)
  },
  QUEUE_QUEUE_PRIO (state, songs) {
    let lastIndex = findLastIndex(state.queue, ['prio', true])
    if (lastIndex < 0) {
      let currentIndex = findIndex(state.queue, state.current)
      lastIndex = currentIndex >= 0 ? currentIndex : -1
    }
    songs = songs.map(song => {
      return { id: generateId(), song, prio: true }
    })
    if (lastIndex === -1) {
      state.queue = songs
      return
    }
    state.queue.splice(lastIndex + 1, 0, ...songs)
  },
  QUEUE_SONG_START (state) {
    let current = state.current
    current.play_start = new Date()
    state.current = current
  },
  QUEUE_SONG_END (state) {
    let current = state.current
    current.play_end = new Date()
    state.history.push(current)
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
  queue ({ commit, dispatch, state }, songs) {
    commit('QUEUE_QUEUE_PRIO', songs)

    if (!state.current.id) {
      dispatch('skip')
      dispatch('Player/play', null, { root: true })
    }
  },
  skip ({ commit, dispatch, getters }) {
    if (!getters.next) return
    let current = getters.currentPlaybackItem
    commit('QUEUE_SET_CURRENT', getters.next)
    if (current.prio) commit('QUEUE_REMOVE_FROM_QUEUE', current)
  },
  back ({ commit, dispatch, getters }) {
    if (!getters.previous) return
    commit('QUEUE_SET_CURRENT', getters.previous)
  },
  started ({ commit }) {
    commit('QUEUE_SONG_START')
  },
  ended ({ commit }) {
    commit('QUEUE_SONG_END')
  },
  remove ({ commit }, item) {
    commit('QUEUE_REMOVE_FROM_QUEUE', item)
  },
  restart ({ commit, getters }) {
    each(getters.prio, item => commit('QUEUE_REMOVE_FROM_QUEUE', item))
    commit('QUEUE_SET_CURRENT', first(state.queue))
  }
}

const getters = {
  context: state => (state.contextActive ? state.context : null),
  currentPlaybackItem: state => state.current,
  currentSong: state =>
    (find(state.queue, item => item === state.current) || {}).song,
  prio: state => state.queue.filter(item => item.prio),
  fullQueue: state => state.queue.filter(item => !item.prio),
  queue: state => {
    let start = findIndex(state.queue, item => item.id === state.current.id)
    return state.queue.filter((item, index) => index > start && !item.prio)
  },
  history: state => state.history,
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

function generateId () {
  return Math.random()
    .toString(36)
    .substr(2, 16)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
