<template>
  <SongList
    :songs="sortedSongs"
    :value="[]"
    artist
    album
    virtual-scroll
    @play="onPlay"
    @context=""
    >

  </SongList>
</template>
<script lang="ts">
import Vue from 'vue'
import { sortBy } from 'lodash'
import { Component, Mixins } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { playerModule, queueModule, mediaModule } from '@/store/namespaces'

import SongList from '@/components/shared/SongList.vue'
import { Artist, Song } from '@/interfaces';

@Component({
  components: {
    SongList,
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

    this.setQueue({ songlist, toPlay: song })
    this.play()
  }
}
</script>