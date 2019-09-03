import { first, sortBy, uniq } from 'lodash'
import axios from '@/services/axios'
import StorageService from '@/services/storage'
import { Album, Artist, Interaction, Playlist, Song } from '@/interfaces'
import { MediaState, RootState } from '../types'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'

const state: MediaState = {
  loading: false,
  albums: [],
  artists: [],
  songs: [],
  playlists: [],
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

    state.playlists = data.playlists.map((playlist: Playlist) => {
      return {
        ...playlist,
        isFavorite: false,
        loaded: false,
        songs: []
      }
    })
  },

  setLoading (state) {
    state.loading = true
  },

  setNotLoading (state) {
    state.loading = false
  },

  setPlaylistSongs (state, { playlist, songs }) {
    state.playlists = state.playlists.map((currentPlaylist: Playlist) => {
      return currentPlaylist.id === playlist.id ? {
        ...playlist,
        loaded: true,
        songs
      } : currentPlaylist
    })
  },

  toggleLike(state, songToUpdate: Song) {
    state.songs = state.songs.map((song: Song) => {
      return (song.id === songToUpdate.id) ? {
        ...song,
        liked: !song.liked
      } : song
    })
  },
}

const actions: ActionTree<MediaState, RootState> = {
  async loadData ({ commit, rootGetters }) {
    const lastData = StorageService.get('data')
    if (lastData) {
      commit('initializeData', JSON.parse(lastData))
    } else {
      commit('setLoading')
    }
    try {
      const { data } = await axios.get(rootGetters['auth/url'] + '/api/data')

      StorageService.set('data', JSON.stringify(data))
      commit('auth/setUser', data, { root: true })
      commit('initializeData', data)
      commit('setNotLoading')
    }
    finally {
      commit('setNotLoading')
    }
  },
  async loadPlaylistSongs ({ rootGetters, commit, getters }, playlist: Playlist) {
    if(!playlist.id || playlist.loaded) return
    commit('setLoading')

    const { data } = await axios.get(`${rootGetters['auth/url']}/api/playlist/${playlist.id}/songs`)
    const songs = getters.songsByIds(data)
    commit('setNotLoading')
    commit('setPlaylistSongs', {
      playlist,
      songs
    })
  },
  increasePlayCount ({ rootGetters }, song) {
    return axios.post(`${rootGetters['auth/url']}/api/interaction/play`, { song: song.id })
  },
  async toggleLike({ rootGetters, commit }, song) {
    commit('toggleLike', song)
    try {
      await axios.post(`${rootGetters['auth/url']}/api/interaction/like`, { song: song.id })
    } catch (e) {
      commit('toggleLike', song)
    }
  }
}

const getters: GetterTree<MediaState, RootState> = {
  album: state => id =>
    first(state.albums.filter(album => album.id === parseInt(id))),
  albums: state => state.albums,
  artist: state => id =>
    first(state.artists.filter(artist => artist.id === parseInt(id))),
  artists: state => state.artists,
  song: (state, getters) => (id: string)=> getters.songs.find((song: Song) => song.id === id),
  songs: state => state.songs,
  songsByIds: (state, getters) => (ids: string[]) => ids.map((id: string) => getters.song(id)),
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
  playlist: (state, getters) => (id: string) => getters.playlists.find((playlist: Playlist) => playlist.id === parseInt(id, 10)),
  playlists: (state, getters) => {
    return [
      {
        id: 0,
        isFavorite: true,
        loaded: true,
        name: 'Favorites',
        songs: getters.likedSongs
      },
      ...state.playlists,
    ]
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
