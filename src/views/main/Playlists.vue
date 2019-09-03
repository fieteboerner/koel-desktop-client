<template>
  <SidebarLayout>
    <PlaylistList
      slot="sidebar"
      :playlists="playlists"
      :value="selected"
      @input="onPlaylistSelected"
      @play="onPlayPlaylist"
    />
    <div>
      <ContextMenu
        ref="ctx"
        context="playlist:song"
        :items="selectionContext.sortedSelected"
        @play="onPlay"
      />
      <SongList
        v-if="selected"
        :songs="sortedSongs"
        :selection-context="selectionContext"
        artist
        album
        virtual-scroll
        @play="onPlay"
        @context="contextSong"
      >
        <EmptyListMessage slot="empty" message="There are no songs in this playlist yet" />
      </SongList>
      <EmptyListMessage v-else message="No Playlist selected" />
    </div>
  </SidebarLayout>
</template>
<script lang="ts">
import Vue from 'vue'
import { first, sortBy } from 'lodash'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { mediaModule, playerModule, queueModule } from '@/store/namespaces'

import SongList from '@/components/shared/SongList.vue'
import PlaylistList from '@/components/shared/PlaylistList.vue'
import EmptyListMessage from '@/components/shared/EmptyListMessage.vue'
import { Artist, Playlist, Song } from '@/interfaces'
import ContextMenu from '@/components/shared/ContextMenu.vue'
import SelectionContext from '@/classes/selection-context'

@Component({
  components: {
    ContextMenu,
    EmptyListMessage,
    PlaylistList,
    SongList
  }
})
export default class Playlists extends Vue {
  selectionContext: SelectionContext<Song> = new SelectionContext(true)

  @mediaModule.Getter songs: Song[]

  @playerModule.Action play
  @queueModule.Action setQueueBySelection
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

  contextSong (event, song) {
    if (!this.selectionContext.isSelected(song)) {
      this.selectionContext.selected = [song]
    }
    this.$refs.ctx.open(event)
  }

  onPlay(event: MouseEvent|KeyboardEvent, song: Song = null) {
    this.setQueueBySelection(this.selectionContext)
    this.play()
  }

  onPlayPlaylist(playlist: Playlist) {
    const songlist: Song[] = playlist.songs
    this.setQueue({
      songlist,
      toPlay: songlist[0]
    })
    this.play()
  }

  @Watch('sortedSongs', { immediate: true })
  onItemChange(songs) {
    this.$set(this.selectionContext, 'items', songs)
  }
}
</script>
