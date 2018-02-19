<template>
  <div>
    <context-menu ref="ctx" context="album:song" @play="play(selected[0])" :items="sortedSelected"></context-menu>
    <div class="columns card-root" tabindex="-1" @keypress.enter="play(selected[0])">
      <div class="column is-4 cover-column">
        <cover-tile :img="album.cover"></cover-tile>
      </div>
      <div class="column is-8 info-column">
        <div class="title is-3">{{ album.name }}</div>
        <div class="subtitle is-4">{{ album.artist.name }}</div>

        <album-song-list :songs="album.songs" :selected="selected"
          @select="selectItem" @play="play" @context="context"></album-song-list>
      </div>
    </div>
  </div>
</template>
<script>
import { sortBy } from 'lodash'
import CoverTile from '@/components/shared/CoverTile.vue'
import ContextMenu from '@/components/shared/ContextMenu.vue'
import AlbumSongList from '@/components/shared/AlbumSongList.vue'
import listSelectMixin from '@/mixins/ListSelect'

export default {
  props: {
    album: Object
  },
  components: { AlbumSongList, ContextMenu, CoverTile },
  mixins: [listSelectMixin],
  computed: {
    items () {
      return sortBy(this.album.songs, ['disc', 'track'])
    }
  },
  methods: {
    play (song) {
      this.$store.dispatch('Queue/set', { songlist: this.items, toPlay: song })
      this.$store.dispatch('Player/play')
    },
    context (event, song) {
      if (!this.isSelected(song)) {
        this.selected = [song]
      }
      this.$refs.ctx.open(event)
    }
  }
}
</script>
<style lang="scss">
.card-root {
  padding-top: 2em;
  padding-left: 2em;
}

.cover-column {
}

.info-column {
  padding-left: 2em;
}
</style>

