import { clone, each, find, findIndex, findLastIndex, first } from 'lodash'
import { QueueItem, Song } from '@/interfaces';
import { QueueState, RootState } from '../types';
import { MutationTree, ActionTree, GetterTree, Module } from 'vuex';

const state: QueueState = {
  context: null,
  contextActive: false,
  queue: [],
  history: [],
  current: {}
}

const mutations: MutationTree<QueueState> = {
  set (state, { songlist, toPlay }) {
    state.queue = songlist.map(song => {
      return { id: generateId(), song, prio: false }
    })

    each(state.queue, (item: QueueItem) => {
      if (item.song === toPlay) {
        state.current = item
        return false
      }
    })
  },
  removeFromQueue (state, item: QueueItem) {
    if (state.current.id === item.id) return

    state.queue = state.queue.filter((queueItem: QueueItem) => queueItem.id !== item.id)
  },
  sort (state, {prio, queueItems}) {
    let queue = []
    if (prio) {
      queue = queueItems.map((item: QueueItem) => {
        item.prio = true
        return item
      })
      state.queue
        .filter((item: QueueItem) => !item.prio && !queueItems.find((queueItem: QueueItem) => queueItem.id === item.id))
        .forEach((item: QueueItem) => queue.push(item))
    } else {
      queue = state.queue.filter((item: QueueItem) => item.prio && !queueItems.find((queueItem: QueueItem) => queueItem.id === item.id))
      queueItems.forEach((queueItem: QueueItem) => {
        queueItem.prio = false
        queue.push(queueItem)
      })
    }
    state.queue = clone(queue)
  },
  queuePrio (state, songs: Song[]) {
    let lastIndex = findLastIndex(state.queue, ['prio', true])
    if (lastIndex < 0) {
      let currentIndex = findIndex(state.queue, state.current)
      lastIndex = currentIndex >= 0 ? currentIndex : -1
    }
    const queue = songs.map((song: Song) => {
      return { id: generateId(), song, prio: true }
    })
    if (lastIndex === -1) {
      state.queue = queue
      return
    }
    state.queue.splice(lastIndex + 1, 0, ...queue)
  },
  songStart (state) {
    let current = state.current
    current.playStart = new Date()
    state.current = current
  },
  songEnd (state) {
    let current = state.current
    current.playEnd = new Date()
    state.history.push(current)
    state.current = current
  },
  setCurrent (state, current) {
    state.current = current
  }
}

const actions: ActionTree<QueueState, RootState> = {
  set ({ commit }, { songlist, toPlay }) {
    commit('set', { songlist, toPlay })
  },
  queue ({ commit, dispatch, state }, songs: Song[]) {
    commit('queuePrio', songs)

    if (!state.current.id) {
      dispatch('skip')
      dispatch('player/play', null, { root: true })
    }
  },
  skip ({ commit, getters }) {
    if (!getters.next) return
    let current = getters.currentPlaybackItem
    commit('setCurrent', getters.next)
    if (current.prio) commit('removeFromQueue', current)
  },
  back ({ commit, getters }) {
    if (!getters.previous) return
    commit('setCurrent', getters.previous)
  },
  started ({ commit }) {
    commit('songStart')
  },
  ended ({ commit }) {
    commit('songEnd')
  },
  remove ({ commit }, item: QueueItem) {
    commit('removeFromQueue', item)
  },
  restart ({ commit, getters }) {
    each(getters.prio, item => commit('removeFromQueue', item))
    commit('setCurrent', first(state.queue))
  }
}

const getters: GetterTree<QueueState, RootState> = {
  context: state => (state.contextActive ? state.context : null),
  currentPlaybackItem: state => state.current,
  currentSong: state =>
    (find(state.queue, (item: QueueItem) => item === state.current) || {}).song,
  prio: state => state.queue.filter((item: QueueItem) => item.prio),
  fullQueue: state => state.queue.filter((item: QueueItem) => !item.prio),
  queue: state => {
    let start = findIndex(state.queue, (item: QueueItem) => item.id === state.current.id)
    return state.queue.filter((item: QueueItem, index: number) => index > start && !item.prio)
  },
  history: state => state.history,
  next: state => {
    // handle repeat / shuffle
    let currentIndex = findIndex(
      state.queue,
      (item: QueueItem) => item.id === state.current.id
    )
    if (!state.queue[++currentIndex]) return false
    return state.queue[currentIndex]
  },
  previous: state => {
    // handle repeat / shuffle
    let currentIndex = findIndex(
      state.queue,
      (item: QueueItem) => item.id === state.current.id
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

const QueueModule: Module<QueueState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export default QueueModule