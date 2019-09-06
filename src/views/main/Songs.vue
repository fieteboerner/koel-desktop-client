<template>
  <div style="height: 100%;">
    <ContextMenu
      ref="ctx"
      context="songs:song"
      :items="selectionContext.sortedSelected"
      @play="onPlay"
    />
    <SongList
      :songs="sortedSongs"
      :value="[]"
      :selection-context="selectionContext"
      artist
      album
      virtual-scroll
      @play="onPlay"
      @context="onContext"
    >
      <EmptyListMessage slot="empty" message="No Songs" />
    </SongList>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { sortBy } from 'lodash'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { mediaModule, playerModule, queueModule } from '@/store/namespaces'

import SongList from '@/components/shared/SongList.vue'
import { Artist, Song } from '@/interfaces'
import ContextMenu from '@/components/shared/ContextMenu.vue'
import EmptyListMessage from '@/components/shared/EmptyListMessage.vue'
import SelectionContext from '@/classes/selection-context'

@Component({
  components: {
    ContextMenu,
    SongList,
    EmptyListMessage,
  },
})
export default class Songs extends Vue {
  $refs: { ctx: any }
  selectionContext: SelectionContext<Song> = new SelectionContext(true)

  @mediaModule.Getter songs: Song[]

  @playerModule.Action play
  @queueModule.Action setQueueBySelection

  get sortedSongs() {
    return sortBy(this.songs, ['artist.name', 'album.year', 'album.name', 'disc', 'track'])
  }

  onPlay() {
    this.setQueueBySelection(this.selectionContext)
    this.play()
  }

  onContext(event: MouseEvent) {
    this.$refs.ctx.open(event)
  }

  @Watch('sortedSongs', { immediate: true })
  onItemChange(songs) {
    this.$set(this.selectionContext, 'items', songs)
  }
}
</script>
