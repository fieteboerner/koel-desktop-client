<template>
    <single-layout>
      <div v-infinite-scroll="infiniteHandler" infinite-scroll-disabled="busy" infinite-scroll-distance="100"
           class="cover-container" @click.self="deselect" tabindex="-1" @keyup.esc="deselect">
        <template v-for="album in infiniteAlbums">
          <cover-tile :img="album.cover" :title="album.name" :subtitle="album.artist.name"
            :class="{'is-selected': selected === album}" class="album-item"
            @cover="selectAlbum(album)" @title="selectAlbum(album)"
            @subtitle="$router.push({name: 'artists', params: {id: album.artist.id}})"></cover-tile>
          <transition name="detail-toggle" @after-enter="scrollToSelected">
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
      selected_item: null,
      busy: false,
      items: 0
    }
  },
  computed: {
    ...mapGetters(['albums', 'album']),
    sortedAlbums () {
      return sortBy(this.albums, ['artist.name', 'name'])
    },
    infiniteAlbums () {
      return take(this.sortedAlbums, this.items)
    },
    selected () {
      return this.selected_item || this.album(this.$route.params.id)
    }
  },
  methods: {
    infiniteHandler () {
      this.busy = true
      this.items += 250
      this.busy = false
    },
    selectAlbum (album) {
      if (this.selected !== album) {
        this.selected_item = album
        this.$router.push({ name: 'albums', params: { id: album.id } })
      } else {
        this.deselect()
      }
    },
    deselect () {
      this.selected_item = null
      this.$router.push({ name: 'albums' })
    },
    scrollToSelected () {
      this.$scrollTo('.details', 500, {container: '.main-content', offset: -150})
    }
  }
}
</script>
<style lang="scss">
@import "../../../sass/settings";

.cover-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(325px, 1fr));
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
    border-bottom: 20px solid $light;
  }

  & .details {
    background-color: $light;
    grid-column: 1 / -1;
    margin: 1em -1em 0;
    padding: 1em;
    overflow: hidden;
  }
}

.detail-toggle-enter-active {
  transition: height 0.3s;
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
