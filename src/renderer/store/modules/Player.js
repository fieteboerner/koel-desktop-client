import plyr from 'plyr'

const state = {
  initialized: false,
  playing: false,
  player: null,
  current: null,
  currentTime: 0,
  options: {
    repeat: false,
    shuffle: false
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
    state.player.getMedia().src = url
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
  PLAYER_REPEAT (state) {
    state.options.repeat = !state.options.repeat
    state.options.shuffle = false
  },
  PLAYER_SHUFFLE (state) {
    state.options.shuffle = !state.options.shuffle
    state.options.repeat = false
  }
}

const actions = {
  init ({ commit, dispatch, state }, audioElement) {
    if (state.initialized) return
    commit('PLAYER_INIT', audioElement)
    state.player
      .getMedia()
      .addEventListener('timeupdate', ({ target }) =>
        commit('PLAYER_UPDATE_CURRENT_TIME', target.currentTime)
      )
    state.player
      .getMedia()
      .addEventListener('ended', ({ target }) => dispatch('ended'))
    state.player
      .getMedia()
      .addEventListener('canplaythough', ({ target }) => dispatch('ended'))
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
  restart ({ commit, rootGetters }) {
    if (!rootGetters['Queue/currentSong']) return
    commit('PLAYER_RESTART')
  },
  resume ({ commit, dispatch, getters }) {
    if (!getters.current) {
      dispatch('skip')
      return
    }
    commit('PLAYER_RESUME')
  },
  skip ({ dispatch, rootGetters }) {
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
    state.options.repeat ? dispatch('restart') : dispatch('skip')
  }
}

const getters = {
  current: (state, getters, test, rootGetters) => {
    return rootGetters['Queue/currentSong']
  },
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
