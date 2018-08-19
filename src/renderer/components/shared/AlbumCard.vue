<template>
  <div>
    <context-menu
      ref="ctx"
      :items="sortedSelected"
      context="album:song"
      @play="onPlay(selected[0])"
    />
    <div class="columns card-root" tabindex="-1" @keypress.enter="onPlay(selected[0])">
      <div class="column is-4 cover-column">
        <cover-tile :img="album.cover"></cover-tile>
      </div>
      <div class="column is-8 info-column">
        <div class="title is-3">{{ album.name }}</div>
        <div class="subtitle is-4">{{ album.artist.name }}</div>

        <album-song-list
          :selected="selected"
          :songs="album.songs"
          @context="onContext"
          @play="play"
          @select="selectItem"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { sortBy } from 'lodash'

import { playerModule, queueModule } from '@/store/namespaces'

import CoverTile from '@/components/shared/CoverTile.vue'
import ContextMenu from '@/components/shared/ContextMenu.vue'
import AlbumSongList from '@/components/shared/AlbumSongList.vue'
import ListSelectMixin from '@/mixins/ListSelect'


@Component({
  components: {
    AlbumSongList,
    ContextMenu,
    CoverTile
  },
})
export default class AlbumCard extends mixins(ListSelectMixin) {
  $refs: {
    ctx: ContextMenu,
  }
  @Prop(Object) album

  @playerModule.Action play
  @queueModule.Action('set') setQueue

  get items() {
    return sortBy(this.album.songs, ['disc', 'track'])
  }

  onPlay(song) {
    this.setQueue()
    this.play()
  }

  onContext(event, song) {
      if (!this.isSelected(song)) {
        this.selected = [song]
      }
      this.$refs.ctx.open(event)
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

