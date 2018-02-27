<template>
  <sidebar-layout>
    <div slot="sidebar">
      <div class="sidebar-list">
        <div class="sidebar-list-item" :class="{'is-selected': selected === artist}"
          v-for="artist in sortedArtists" @click="selectArtist(artist)" @dblclick="play">
          <figure class="sidebar-item-image image is-48x48">
            <img :src="artist.albums[0].cover" alt="artist.name">
          </figure>
          <div class="sidebar-item-content is-6 truncate" :title="artist.name">
            {{ artist.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="artist-albums">
      <artist-card :artist="selected" v-if="selected"></artist-card>
      <div v-else class="subtitle is-3">
        No Artists
      </div>
    </div>
  </sidebar-layout>
</template>
<script>
import ArtistCard from '@/components/shared/ArtistCard.vue'
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
    ...mapGetters(['artist', 'artists', 'artistSongs']),
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
    play () {
      let songlist = this.artistSongs(this.selected)
      this.$store.dispatch('Queue/set', { songlist, toPlay: songlist[0] })
      this.$store.dispatch('Player/play')
    },
    press (event) {
      console.log(event)
    }
  }
}
</script>
<style lang="scss">
@import '../../../sass/settings';

.sidebar-list-item {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  overflow: hidden;
  cursor: default;

  &.is-selected {
    background-color: $cyan;

    & .sidebar-item-content {
      color: $white !important;
    }
  }
}

.sidebar-item-image img {
  height: 100%;
  border-radius: 50%;
}

.sidebar-item-content {
  flex: 1;
  padding-left: 1em;
  padding-right: 1em;
}
</style>
