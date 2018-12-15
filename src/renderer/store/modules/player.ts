import plyr from 'plyr'

const state = {
  initialized: false,
  playing: false,
  player: null,
  current: null,
  currentTime: 0,
  repeatModes: ['OFF', 'ALL', 'ONE'],
  options: {
    repeat: 'OFF',
    shuffle: false,
    volume: parseInt(window.localStorage.getItem('player-volume')) || 7,
    muted: false
  }
}

const mutations = {
  init (state, element) {
    state.player = plyr.setup(element, {
      controls: ['progress'],
      loadSprite: false
    })[0]
    state.player.setVolume(state.options.volume)
    state.options.muted = state.player.isMuted()

    state.initialized = true
  },
  destroy (state) {
    let audioCopy = state.player.getMedia().cloneNode(true)
    state.player
      .getMedia()
      .parentNode.replaceChild(audioCopy, state.player.getMedia())
    state.player.destroy()

    state.initialized = false
  },
  updateCurrentTime (state, currentTime) {
    state.currentTime = currentTime
  },
  play (state, { song, url }) {
    state.player.source({
      type: 'audio',
      title: `${song.title} - ${song.artist.name}`,
      sources: [{ src: url }]
    })
  },
  pause (state) {
    state.player.pause()
    state.playing = false
  },
  resume (state) {
    state.player.play()
    state.playing = true
  },
  restart (state) {
    state.player.restart()
  },
  toggleRepeat (state) {
    let current = state.repeatModes.indexOf(state.options.repeat)
    let nextIndex = state.repeatModes[++current] ? current : 0
    state.options.repeat = state.repeatModes[nextIndex]
  },
  toggleShuffle (state) {
    state.options.shuffle = !state.options.shuffle
  },
  setVolume (state, volume) {
    state.options.volume = volume
    state.player.setVolume(volume)
    window.localStorage.setItem('player-volume', volume)
  },
  toggleMute (state) {
    state.player.toggleMute()
    state.options.muted = state.player.isMuted()
  }
}

const actions = {
  init ({ commit, dispatch, state }, audioElement) {
    if (state.initialized) return
    commit('init', audioElement)
    state.player.on('timeupdate', ({ detail }) =>
      commit('updateCurrentTime', detail.plyr.getCurrentTime())
    )
    state.player.on('ended', () => dispatch('ended'))
    state.player.on('canplaythough', () => dispatch('ended'))
  },
  destroy ({ commit, state }) {
    if (!state.initialized) return

    commit('destroy')
  },
  play ({ commit, dispatch, rootGetters }) {
    commit('play', {
      song: rootGetters['queue/currentSong'],
      url: rootGetters['media/songurl'](rootGetters['queue/currentSong'])
    })
    dispatch('queue/started', null, { root: true })
    dispatch('resume')
  },
  pause ({ commit }) {
    commit('pause')
  },
  restart ({ commit, dispatch, rootGetters }) {
    if (!rootGetters['queue/currentSong']) return
    commit('restart')
    dispatch('play')
  },
  resume ({ commit, dispatch, getters }) {
    if (!getters.current) {
      dispatch('skip')
      return
    }
    commit('resume')
  },
  skip ({ dispatch, rootGetters }) {
    if (!rootGetters['queue/next'] && state.options.repeat === 'ALL') {
      return dispatch('queue/restart', null, { root: true })
    }
    if (!rootGetters['queue/next']) return dispatch('pause')
    dispatch('queue/skip', null, { root: true })
    dispatch('play')
  },
  back ({ state, dispatch, rootGetters }) {
    if (state.currentTime > 5) return dispatch('restart')
    if (!rootGetters['queue/previous']) return dispatch('pause')
    dispatch('queue/back', null, { root: true })
    dispatch('play')
  },
  togglePlayback ({ dispatch, getters }) {
    dispatch(getters.playing ? 'pause' : 'resume')
  },
  ended ({ commit, dispatch, getters, state }) {
    dispatch('queue/ended', null, { root: true })
    dispatch('media/increasePlayCount', getters.current, { root: true })
    if (state.options.repeat === 'ONE') return dispatch('restart')

    dispatch('skip')
  },
  setVolume ({ commit }, volume) {
    commit('setVolume', volume)
  },
  toggleMute ({ commit, getters }) {
    commit('toggleMute')
    if (!getters.muted && !getters.volume) commit('setVolume', 5)
  }
}

const getters = {
  current: (state, getters, test, rootGetters) => {
    return rootGetters['queue/currentSong']
  },
  currentTime: state => state.currentTime,
  duration: state => (state.current ? state.current.length : 0),
  muted: state => state.options.muted,
  playing: state => state.playing,
  repeat: state => state.options.repeat,
  shuffle: state => state.options.shuffle,
  volume: state => (state.options.muted ? 0 : state.options.volume)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
