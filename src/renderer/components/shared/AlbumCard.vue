<template>
  <div class="columns card-root">
    <div class="column is-4 cover-column">
      <cover-tile :img="album.cover"></cover-tile>
    </div>
    <div class="column is-8 info-column">
      <div class="title is-3">{{ album.name }}</div>
      <div class="subtitle is-4">{{ album.artist.name }}</div>

      <album-song-list :album="album"></album-song-list>
    </div>
  </div>
</template>
<script>
import CoverTile from '@/components/shared/CoverTile.vue'
import AlbumSongList from '@/components/shared/AlbumSongList.vue'
export default {
  props: {
    album: Object
  },
  components: { AlbumSongList, CoverTile }
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

