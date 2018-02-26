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
    volume: parseInt(window.localStorage.getItem('player-volume')) || 5,
    muted: false
  },
  previous: [], // for previous function
  playback: [], // normal list of opcoming song if no item in queue is found
  queue: [] // queue like in spotify
}

const mutations = {
  PLAYER_INIT (state, element) {
    state.player = plyr.setup(element, {
      controls: ['progress'],
      loadSprite: false
    })[0]
    state.player.setVolume(state.options.volume)
    state.options.muted = state.player.isMuted()

    state.initialized = true
  },
  PLAYER_DESTROY (state) {
    let audioCopy = state.player.getMedia().cloneNode(true)
    state.player
      .getMedia()
      .parentNode.replaceChild(audioCopy, state.player.getMedia())
    state.player.destroy()

    state.initialized = false
  },
  PLAYER_UPDATE_CURRENT_TIME (state, currentTime) {
    state.currentTime = currentTime
  },
  PLAYER_PLAY (state, { song, url }) {
    state.player.source({
      type: 'audio',
      title: `${song.title} - ${song.artist.name}`,
      sources: [{ src: url }]
    })
  },
  PLAYER_PAUSE (state) {
    state.player.pause()
    state.playing = false
  },
  PLAYER_RESUME (state) {
    state.player.play()
    state.playing = true
  },
  PLAYER_RESTART (state) {
    state.player.restart()
  },
  PLAYER_TOGGLE_REPEAT (state) {
    let current = state.repeatModes.indexOf(state.options.repeat)
    let nextIndex = state.repeatModes[++current] ? current : 0
    state.options.repeat = state.repeatModes[nextIndex]
  },
  PLAYER_SHUFFLE (state) {
    state.options.shuffle = !state.options.shuffle
  },
  PLAYER_SET_VOLUME (state, volume) {
    state.options.volume = volume
    state.player.setVolume(volume)
    window.localStorage.setItem('player-volume', volume)
  },
  PLAYER_TOGGLE_MUTE (state) {
    state.player.toggleMute()
    state.options.muted = state.player.isMuted()
  }
}

const actions = {
  init ({ commit, dispatch, state }, audioElement) {
    if (state.initialized) return
    commit('PLAYER_INIT', audioElement)
    state.player.on('timeupdate', ({ detail }) =>
      commit('PLAYER_UPDATE_CURRENT_TIME', detail.plyr.getCurrentTime())
    )
    state.player.on('ended', () => dispatch('ended'))
    state.player.on('canplaythough', () => dispatch('ended'))
  },
  destroy ({ commit, state }) {
    if (!state.initialized) return

    commit('PLAYER_DESTROY')
  },
  play ({ commit, dispatch, rootGetters }) {
    commit('PLAYER_PLAY', {
      song: rootGetters['Queue/currentSong'],
      url: rootGetters.songurl(rootGetters['Queue/currentSong'])
    })
    dispatch('Queue/started', null, { root: true })
    dispatch('resume')
  },
  pause ({ commit }) {
    commit('PLAYER_PAUSE')
  },
  restart ({ commit, dispatch, rootGetters }) {
    if (!rootGetters['Queue/currentSong']) return
    commit('PLAYER_RESTART')
    dispatch('play')
  },
  resume ({ commit, dispatch, getters }) {
    if (!getters.current) {
      dispatch('skip')
      return
    }
    commit('PLAYER_RESUME')
  },
  skip ({ dispatch, rootGetters }) {
    if (!rootGetters['Queue/next'] && state.options.repeat === 'ALL') {
      return dispatch('Queue/restart', null, { root: true })
    }
    if (!rootGetters['Queue/next']) return dispatch('pause')
    dispatch('Queue/skip', null, { root: true })
    dispatch('play')
  },
  back ({ state, dispatch, rootGetters }) {
    if (state.currentTime > 5) return dispatch('restart')
    if (!rootGetters['Queue/previous']) return dispatch('pause')
    dispatch('Queue/back', null, { root: true })
    dispatch('play')
  },
  toggle ({ dispatch, getters }) {
    dispatch(getters.playing ? 'pause' : 'resume')
  },
  ended ({ commit, dispatch, state }, song) {
    dispatch('Queue/ended', null, { root: true })
    if (state.options.repeat === 'ONE') return dispatch('restart')

    dispatch('skip')
  },
  setVolume ({ commit }, volume) {
    commit('PLAYER_SET_VOLUME', volume)
  },
  toggleMute ({ commit, getters }) {
    commit('PLAYER_TOGGLE_MUTE')
    if (!getters.muted && !getters.volume) commit('PLAYER_SET_VOLUME', 5)
  }
}

const getters = {
  current: (state, getters, test, rootGetters) => {
    return rootGetters['Queue/currentSong']
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
