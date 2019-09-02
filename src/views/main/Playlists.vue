<template>
  <sidebar-layout>
    <div slot="sidebar">
      <PlaylistList
        :playlists="playlists"
        :value="selected"
        @input="onPlaylistSelected"
        @play="onPlayPlaylist"
      />
    </div>
    <div class="artist-albums">
      <SongList
        v-if="selected"
        :songs="selected.songs"
        artist
        album
        virtual-scroll
        @play="onPlay"
      >
        <empty-list-message slot="empty" message="There are no songs in this playlist yet" />
      </SongList>
      <empty-list-message v-else message="No Playlist selected" />
    </div>
  </sidebar-layout>
</template>
<script lang="ts">
import Vue from 'vue'
import { first, sortBy } from 'lodash'
import { Component, Mixins } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { mediaModule, playerModule, queueModule } from '@/store/namespaces'

import SongList from '@/components/shared/SongList.vue'
import PlaylistList from '@/components/shared/PlaylistList.vue'
import EmptyListMessage from '@/components/shared/EmptyListMessage.vue'
import { Artist, Playlist, Song } from '@/interfaces'

@Component({
  components: {
    EmptyListMessage,
    PlaylistList,
    SongList
  }
})
export default class Playlists extends Vue {
  @mediaModule.Getter songs: Array<Song>

  @playerModule.Action play
  @queueModule.Action('set') setQueue
  @mediaModule.Getter playlists: Playlist[]
  @mediaModule.Getter playlist: Function
  @mediaModule.Action loadPlaylistSongs

  get selected() {
    const playlistId = this.$route.params.id
    const playlist = this.playlist(playlistId) || first(this.playlists)
    this.loadPlaylistSongs(playlist)

    return playlist
  }

  get sortedSongs() {
    return this.selected.songs || []
  }

  onPlaylistSelected(playlist: Playlist) {
    this.$router.push({
      name: 'playlists',
      params: { id: playlist.id.toString() }
    })
  }

  onPlay (event: MouseEvent|KeyboardEvent, song: Song = null) {
    song = song || this.sortedSongs[0]
    const startIndex = this.sortedSongs.indexOf(song)
    const songlist = this.sortedSongs.filter((song, index) => index >= startIndex)

    this.setQueue({ songlist, toPlay: song })
    this.play()
  }

  onPlayPlaylist(playlist: Playlist) {
    const songlist: Song[] = playlist.songs
    this.setQueue({ songlist, toPlay: songlist[0] })
    this.play()
  }

}
</script>