import { first, sortBy, uniq } from 'lodash'
import axios from '@/services/axios'
import { Album, Artist, Song } from '@/interfaces'

const state = {
  loading: <boolean> false,
  albums: <Album[]> [],
  artists: <Artist[]> [],
  songs: <Song[]> []
}

const mutations = {
  MEDIA_SUCCESS (state, data) {
    let artistAlbumCache = {}
    state.albums = data.albums.map(album => {
      album.songs = data.songs.filter(
        song => parseInt(song.album_id) === album.id
      )
      album.artist = data.artists.find(
        artist => artist.id === album.artist_id
      )
      return album
    })
    state.songs = data.songs.map(song => {
      song.album = state.albums.find(
        album => album.id === parseInt(song.album_id)
      )
      song.artist = data.artists.find(
        artist => artist.id === parseInt(song.artist_id)
      )
      const artistId = parseInt(song.artist_id)
      if (!artistAlbumCache[artistId]) artistAlbumCache[artistId] = []
      artistAlbumCache[artistId].push(song.album)
      return song
    })
    state.artists = data.artists.map(artist => {
      artist.albums = uniq(artistAlbumCache[artist.id])
      return artist
    })
  },

  MEDIA_SET_LOADING (state) {
    state.loading = true
  },

  MEDIA_SET_NOT_LOADING (state) {
    state.loading = false
  }
}

const actions = {
  DATA_REQUEST ({ commit, state, rootGetters }) {
    commit('MEDIA_SET_LOADING')
    return new Promise((resolve, reject) => {
      axios
        .get(rootGetters['auth/url'] + '/api/data')
        .then(resp => {
          commit('auth/setUser', resp.data)
          commit('MEDIA_SUCCESS', resp.data)
          commit('MEDIA_SET_NOT_LOADING')
          resolve()
        })
        .catch(error => {
          commit('MEDIA_SET_NOT_LOADING')
          reject(error)
        })
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
    `${rootGetters['auth/url']}/api/${song.id}/play?jwt-token=${rootGetters['auth/token']}`,
  sharableUrl: (state, getters, rootState, rootGetters) => song =>
    `${rootGetters['auth/url']}#!/song/${song.id}`,
  albumSongs: state => album => {
    let songs = []
    sortBy(album.songs, ['disc', 'track']).forEach(song => songs.push(song))
    return songs
  },
  artistSongs: (state, getters) => artist => {
    let albums = sortBy(artist.albums, ['year', 'name'])
    let songs = []
    albums.forEach(album => getters.albumSongs(album).forEach(song => songs.push(song)))
    return songs
  },
  loading: state => state.loading
}

export default {
  state,
  mutations,
  actions,
  getters
}
