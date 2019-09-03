<template>
  <div>
    <ContextMenu
      ref="ctx"
      :items="selectionContext.sortedSelected"
      context="album:song"
      @play="onPlay"
    />
    <div class="columns card-root" tabindex="-1" @keypress.enter="onPlay">
      <div class="column is-4 cover-column">
        <CoverTile :img="album.cover" />
      </div>
      <div class="column is-8 info-column">
        <div class="title is-3">
          {{ album.name }}
        </div>
        <div class="subtitle is-4">
          {{ album.artist.name }}
        </div>

        <AlbumSongList
          :selection-context="selectionContext"
          :songs="album.songs"
          @context="onContext"
          @play="onPlay"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { sortBy } from 'lodash'

import { playerModule, queueModule } from '@/store/namespaces'

import CoverTile from '@/components/shared/CoverTile.vue'
import ContextMenu from '@/components/shared/ContextMenu.vue'
import AlbumSongList from '@/components/shared/AlbumSongList.vue'
import { Song } from '@/interfaces'
import SelectionContext from '@/classes/selection-context'


@Component({
  components: {
    AlbumSongList,
    ContextMenu,
    CoverTile
  },
})
export default class AlbumCard extends Vue {
  $refs: {
    ctx: any,
  }
  selectionContext: SelectionContext<Song> = new SelectionContext(true)
  @Prop(Object) album

  @playerModule.Action play
  @queueModule.Action('set') setQueue

  get songs(): Song[] {
    return sortBy(this.album.songs, ['disc', 'track'])
  }

  onPlay (event: MouseEvent|KeyboardEvent, song: Song = null) {
    song = song || this.selectionContext.sortedSelected[0] || this.songs[0]
    const startIndex = this.songs.indexOf(song)
    const songlist = this.songs.filter((song, index) => index >= startIndex)

    this.setQueue({
      songlist,
      toPlay: song 
    })
    this.play()
  }

  onContext(event, song: Song) {
    if (!this.selectionContext.isSelected(song)) {
      this.selectionContext.selected = [song]
    }
    this.$refs.ctx.open(event)
  }

  @Watch('songs', { immediate: true })
  onItemChange(songs) {
    this.$set(this.selectionContext, 'items', songs)
  }
}
</script>
<style lang="scss">
.card-root {
  padding-top: 2em;
  padding-left: 2em;
}

.info-column {
  padding-left: 2em;
}
</style>

