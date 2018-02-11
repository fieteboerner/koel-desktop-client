<template>
  <sidebar-layout>
    <div slot="sidebar">
      <div class="sidebar-list">
        <div class="sidebar-list-item" :class="{'is-selected': selected === artist}"
          v-for="artist in sortedArtists" @click="selectArtist(artist)">
          <figure class="sidebar-item-image image is-48x48">
            <img :src="artist.albums[0].cover" alt="artist.name">
          </figure>
          <div class="sidebar-item-content">
            <span class="item-text subtitle truncate">{{ artist.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="artist-albums">
      <artist-card :artist="selected" v-if="selected"></artist-card>
      <div v-else>
        No Artists
      </div>
    </div>
  </sidebar-layout>
</template>
<script>
import ArtistCard from '../shared/ArtistCard.vue'
import { mapGetters } from 'vuex'
import { first, sortBy } from 'lodash'

export default {
  components: { ArtistCard },
  data () {
    return {
      selected_item: null
    }
  },
  computed: {
    ...mapGetters(['artist', 'artists']),
    sortedArtists () {
      return sortBy(this.artists, ['name']).filter(
        artist => artist.albums.length > 0
      )
    },
    selected () {
      return (
        this.selected_item ||
        this.artist(this.$route.params.id) ||
        first(this.sortedArtists)
      )
    }
  },
  methods: {
    selectArtist (artist) {
      this.selected_item = artist
      this.$router.push({ name: 'artists', params: { id: artist.id } })
    },
    press (event) {
      console.log(event)
    }
  }
}
</script>
<style lang="scss">
.sidebar-list-item {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  overflow: hidden;
  cursor: pointer;
}

.sidebar-list-item.is-selected {
  background-color: #2586fa;
}

.sidebar-list-item.is-selected .item-text {
  color: #fefefe !important;
}

.sidebar-item-image {
  width: 48px;
}

.sidebar-item-image img {
  border-radius: 50%;
}

.sidebar-item-content {
  flex: 1;
  padding-left: 1em;
  padding-right: 1em;
}
</style>
