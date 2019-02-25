import { first, sortBy, uniq } from 'lodash'
import axios from '@/services/axios'
import { Album, Artist, Song, Interaction } from '@/interfaces'
import { MediaState, RootState } from '../types';
import { MutationTree, ActionTree, GetterTree, Module } from 'vuex';

const state: MediaState = {
  loading: false,
  albums: [],
  artists: [],
  songs: []
}

const mutations: MutationTree<MediaState> = {
  initializeData (state, data) {
    let artistAlbumCache = {}
    state.albums = data.albums.map((album: Album) => {
      album.songs = data.songs.filter(
        (song: Song) => parseInt(song.album_id.toString()) === album.id
      )
      album.artist = data.artists.find(
        (artist: Artist) => artist.id === album.artist_id
      )
      return album
    })
    state.songs = data.songs.map((song: Song) => {
      song.album = state.albums.find(
        album => album.id === parseInt(song.album_id.toString())
      )
      song.artist = data.artists.find(
        (artist: Artist) => artist.id === parseInt(song.artist_id.toString())
      )
      const artistId = parseInt(song.artist_id.toString())
      if (!artistAlbumCache[artistId]) artistAlbumCache[artistId] = []
      artistAlbumCache[artistId].push(song.album)

      const interaction: Interaction = data.interactions.find((interaction: Interaction) => interaction.song_id === song.id) || {}
      song.liked = interaction.liked || false
      song.playCount = interaction.play_count || 0

      return song
    })
    state.artists = data.artists.map((artist: Artist) => {
      artist.albums = uniq(artistAlbumCache[artist.id])
      return artist
    })
  },

  setLoading (state) {
    state.loading = true
  },

  setNotLoading (state) {
    state.loading = false
  },

  toggleLike(state, songToUpdate: Song) {
    state.songs = state.songs.map((song: Song) => {
      return (song.id === songToUpdate.id) ? { ...song, liked: !song.liked } : song
    })
  },
}

const actions: ActionTree<MediaState, RootState> = {
  loadData ({ commit, rootGetters }) {
    commit('setLoading')
    return new Promise((resolve, reject) => {
      axios
        .get(rootGetters['auth/url'] + '/api/data')
        .then(resp => {
          commit('auth/setUser', resp.data, { root: true })
          commit('initializeData', resp.data)
          commit('setNotLoading')
          resolve()
        })
        .catch(error => {
          commit('setNotLoading')
          reject(error)
        })
    })
  },
  increasePlayCount ({ rootGetters }, song) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${rootGetters['auth/url']}/api/interaction/play`, { song: song.id })
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  toggleLike({ rootGetters, commit }, song) {
    commit('toggleLike', song)
    axios
      .post(`${rootGetters['auth/url']}/api/interaction/like`, { song: song.id })
      .catch( () => commit('toggleLike', song))
  }
}

const getters: GetterTree<MediaState, RootState> = {
  album: state => id =>
    first(state.albums.filter(album => album.id === parseInt(id))),
  albums: state => state.albums,
  artist: state => id =>
    first(state.artists.filter(artist => artist.id === parseInt(id))),
  artists: state => state.artists,
  songs: state => state.songs,
  likedSongs: (state, getters) => getters.songs.filter((song: Song) => song.liked),
  isSongLiked: (state, getters) => (songToCheck: Song) => !!getters.likedSongs.find((song: Song) => song.id === songToCheck.id && song.liked),
  songurl: (state, getters, rootState, rootGetters) => (song: Song) =>
    `${rootGetters['auth/url']}/api/${song.id}/play?jwt-token=${rootGetters['auth/token']}`,
  sharableUrl: (state, getters, rootState, rootGetters) => (song: Song) =>
    `${rootGetters['auth/url']}#!/song/${song.id}`,
  albumSongs: state => (album: Album) => {
    let songs = []
    sortBy(album.songs, ['disc', 'track']).forEach((song: Song) => songs.push(song))
    return songs
  },
  artistSongs: (state, getters) => (artist: Artist) => {
    let albums = sortBy(artist.albums, ['year', 'name'])
    let songs = []
    albums.forEach((album: Album) => getters.albumSongs(album).forEach((song: Song) => songs.push(song)))
    return songs
  },
  loading: state => state.loading
}

const MediaModule: Module<MediaState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export default MediaModule