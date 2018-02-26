import axios from 'axios'
import { first, uniq } from 'lodash'
const state = {
  albums: [],
  artists: [],
  songs: []
}

const mutations = {
  MEDIA_SUCCESS (state, data) {
    let artistAlbumCache = {}
    state.user = data.currentUser
    state.albums = data.albums.map(album => {
      album.songs = data.songs.filter(
        song => parseInt(song.album_id) === album.id
      )
      album.artist = data.artists.filter(
        artist => artist.id === album.artist_id
      )[0]
      return album
    })
    state.songs = data.songs.map(song => {
      song.album = state.albums.filter(
        album => album.id === parseInt(song.album_id)
      )[0]
      song.artist = data.artists.filter(
        artist => artist.id === parseInt(song.artist_id)
      )[0]
      const artistId = parseInt(song.artist_id)
      if (!artistAlbumCache[artistId]) artistAlbumCache[artistId] = []
      artistAlbumCache[artistId].push(song.album)
      return song
    })
    state.artists = data.artists.map(artist => {
      artist.albums = uniq(artistAlbumCache[artist.id])
      return artist
    })
  }
}

const actions = {
  DATA_REQUEST ({ commit, state, getters }) {
    return new Promise((resolve, reject) => {
      axios
        .get(getters.url + '/api/data')
        .then(resp => {
          commit('AUTH_USER', resp.data)
          commit('MEDIA_SUCCESS', resp.data)
          resolve()
        })
        .catch(error => reject(error))
    })
  },
  MEDIA_INCREASE_PLAY_COUNT ({ commit, getters }, song) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${getters.url}/api/interaction/play`, { song: song.id })
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  }
}

const getters = {
  album: state => id =>
    first(state.albums.filter(album => album.id === parseInt(id))),
  albums: state => state.albums,
  artist: state => id =>
    first(state.artists.filter(artist => artist.id === parseInt(id))),
  artists: state => state.artists,
  songs: state => state.songs,
  songurl: (state, getters, rootState, rootGetters) => song =>
    `${rootGetters.url}/api/${song.id}/play?jwt-token=${rootGetters.token}`,
  sharableUrl: (state, getters, rootState, rootGetters) => song =>
    `${rootGetters.url}#!/song/${song.id}`
}

export default {
  state,
  mutations,
  actions,
  getters
}
