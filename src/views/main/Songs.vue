<template>
  <SongList
    :songs="sortedSongs"
    :value="[]"
    artist
    album
    virtual-scroll
    @play="onPlay"
  >
    <EmptyListMessage slot="empty" message="No Songs" />
  </SongList>
</template>
<script lang="ts">
import Vue from 'vue'
import { sortBy } from 'lodash'
import { Component, Mixins } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { mediaModule, playerModule, queueModule } from '@/store/namespaces'

import SongList from '@/components/shared/SongList.vue'
import { Artist, Song } from '@/interfaces'
import EmptyListMessage from '@/components/shared/EmptyListMessage.vue'

@Component({
  components: {
    SongList,
    EmptyListMessage,
  },
})
export default class Songs extends Vue {
  @mediaModule.Getter songs: Array<Song>

  @playerModule.Action play
  @queueModule.Action('set') setQueue

  get sortedSongs() {
    return sortBy(this.songs, ['artist.name', 'album.year', 'album.name', 'disc', 'track'])
  }

  onPlay(event: KeyboardEvent|MouseEvent, song: Song = null) {
    song = song || this.sortedSongs[0]
    const startIndex = this.sortedSongs.indexOf(song)
    const songlist = this.sortedSongs.filter((song, index) => index >= startIndex)

    this.setQueue({
      songlist,
      toPlay: song 
    })
    this.play()
  }
}
</script>