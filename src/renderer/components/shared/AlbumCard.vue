<template>
  <div class="columns card-root">
    <div class="column is-4 cover-column">
      <cover-tile :img="album.cover"></cover-tile>
    </div>
    <div class="column is-8 info-column">
      <div class="title is-3">{{ album.name }}</div>
      <div class="subtitle is-4">{{ album.artist.name }}</div>

      <album-song-list :songs="album.songs" :selected="selected" @select="selectItem" @play="play"></album-song-list>
    </div>
  </div>
</template>
<script>
import { sortBy } from 'lodash'
import CoverTile from '@/components/shared/CoverTile.vue'
import AlbumSongList from '@/components/shared/AlbumSongList.vue'
import listSelectMixin from '@/mixins/ListSelect'
export default {
  props: {
    album: Object
  },
  components: { AlbumSongList, CoverTile },
  mixins: [ listSelectMixin ],
  computed: {
    items () {
      return sortBy(this.album.songs, ['disc', 'track'])
    }
  },
  methods: {
    play (song) {
      let found = false
      const songs = this.items.filter(s => {
        if (found) return true
        if (s !== song) return false
        found = true
        return true
      })
      this.$store.dispatch('Player/play', songs)
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

