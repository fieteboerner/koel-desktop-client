<template>
    <single-layout>
      <div v-infinite-scroll="infiniteHandler" infinite-scroll-disabled="busy" infinite-scroll-distance="100"
           class="columns is-multiline">
        <div v-for="album in infiniteAlbums" class="column is-one-quarter" :key="album.id">
          <cover-tile :img="album.cover" :title="album.name" :subtitle="album.artist.name"
            @cover="selected = selected === album ? null : album"
            @subtitle="$router.push({name: 'artists', params: {id: album.artist.id}})"></cover-tile>
          <div v-if="album === selected">
            <pre>
              Albumliste
            </pre>
          </div>
        </div>
      </div>
    </single-layout>
</template>
<script>
import InfiniteScroll from 'vue-infinite-scroll'
import { mapGetters } from 'vuex'
import { sortBy, take } from 'lodash'
import CoverTile from '@/components/shared/CoverTile.vue'

export default {
  components: {
    CoverTile,
    InfiniteScroll
  },
  data () {
    return {
      selected: null,
      busy: false,
      items: 0
    }
  },
  computed: {
    ...mapGetters(['albums']),
    sortedAlbums () {
      return sortBy(this.albums, ['artist.name', 'name'])
    },
    infiniteAlbums () {
      return take(this.sortedAlbums, this.items)
    }
  },
  methods: {
    infiniteHandler () {
      this.busy = true
      this.items += 16
      this.busy = false
    }
  }
}
</script>