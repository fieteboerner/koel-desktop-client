<template>
    <single-layout>
      <div v-infinite-scroll="infiniteHandler" infinite-scroll-disabled="busy" infinite-scroll-distance="100"
           class="cover-container" @click.self="selected = null" tabindex="-1" @keyup.esc="selected = null">
        <template v-for="album in infiniteAlbums">
          <cover-tile :img="album.cover" :title="album.name" :subtitle="album.artist.name"
            :class="{'is-selected': selected === album}" class="album-item"
            @cover="selected = selected === album ? null : album"
            @subtitle="$router.push({name: 'artists', params: {id: album.artist.id}})"></cover-tile>
          <transition name="detail-toggle">
            <div class="details" v-if="selected === album">
              <album-card :album="album"></album-card>
            </div>
          </transition>
        </template>
      </div>
    </single-layout>
</template>
<script>
import InfiniteScroll from 'vue-infinite-scroll'
import { mapGetters } from 'vuex'
import { sortBy, take } from 'lodash'
import CoverTile from '@/components/shared/CoverTile.vue'
import AlbumCard from '@/components/shared/AlbumCard.vue'

export default {
  components: {
    AlbumCard,
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
      this.items += 24
      this.busy = false
    }
  }
}
</script>
<style lang="scss">
.cover-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1em;
  grid-auto-flow: row dense;

  & .album-item.is-selected::after {
    content: '';
    position: absolute;
    left: 42%;
    top: calc(100% + 1em);
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 20px solid #f6f6f8;
  }

  & .details {
    background-color: #f6f6f8;
    grid-column: 1 / -1;
    margin: 1em -1em 0;
    padding: 1em;
    overflow: hidden;
  }
}

.detail-toggle-enter-active {
  transition: height 6.75s;
}
.detail-toggle-enter-active {
  height: auto;
}
.detail-toggle-enter,
.detail-toggle-leave,
.detail-toggle-leave-active {
  height: 0;
}
</style>
