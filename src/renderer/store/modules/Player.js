import plyr from 'plyr'
import { drop, first } from 'lodash'

const state = {
  audioElement: null,
  initialized: false,
  playing: false,
  player: null,
  current: null,
  currentTime: 0,
  options: {
    repeat: false,
    shuffle: false
  },
  history: [],
  queue: [],
  later: []
}

const mutations = {
  PLAYER_INIT (state, element) {
    state.audioElement = element
    state.player = plyr.setup(element, {
      controls: ['progress'],
      loadSprite: false
    })[0]

    state.initialized = true
  },
  PLAYER_DESTROY (state) {},
  PLAYER_UPDATE_CURRENT_TIME (state, currentTime) {
    state.currentTime = currentTime
  },
  PLAYER_PLAY (state, { song, url }) {
    state.current = song
    state.player.getMedia().src = url
  },
  PLAYER_RESUME (state) {
    if (!state.current) return
    state.player.play()
    state.playing = true
  },
  PLAYER_PAUSE (state) {
    state.player.pause()
    state.playing = false
  },
  PLAYER_NEXT (state) {
    state.current = state.queue.shift()
  },
  PLAYER_REPEAT (state) {
    state.options.repeat = !state.options.repeat
    state.options.shuffle = false
  },
  PLAYER_SHUFFLE (state) {
    state.options.shuffle = !state.options.shuffle
    state.options.repeat = false
  },
  PLAYER_SET_QUEUE (state, songs) {
    state.queue = songs
  }
}

const actions = {
  init ({ commit, dispatch, state }, audioElement) {
    if (state.initialized) return
    commit('PLAYER_INIT', audioElement)
    audioElement.addEventListener('timeupdate', ({ target }) =>
      commit('PLAYER_UPDATE_CURRENT_TIME', target.currentTime)
    )
    audioElement.addEventListener('ended', ({ target }) => dispatch('next'))
  },
  play ({ commit, dispatch, rootGetters }, songs) {
    const song = first(songs)
    commit('PLAYER_PLAY', { song, url: rootGetters.songurl(song) })
    commit('PLAYER_SET_QUEUE', drop(songs))
    dispatch('resume')
  },
  pause ({ commit }) {
    commit('PLAYER_PAUSE')
  },
  resume ({ commit }) {
    commit('PLAYER_RESUME')
  },
  next ({ state, dispatch }) {
    if (!state.queue.length) return dispatch('pause')
    const songs = state.queue
    dispatch('play', songs)
    if (!state.playing) dispatch('resume')
  }
}

const getters = {
  current: state => state.current,
  currentTime: state => state.currentTime,
  duration: state => (state.current ? state.current.length : 0),
  repeat: state => state.options.repeat,
  shuffle: state => state.options.shuffle,
  playing: state => state.playing
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
