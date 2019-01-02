<template>
  <sidebar-layout>
    <div slot="sidebar">
      <div class="sidebar-list">
        <div class="sidebar-list-item" :class="{'is-selected': selected === artist}"
          v-for="artist in sortedArtists" @click="selectArtist(artist)" @dblclick="onPlay"
          :key="artist.id">
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
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { first, sortBy } from 'lodash'
import { Getter } from 'vuex-class'
import { playerModule, queueModule, mediaModule } from '@/store/namespaces'

import ArtistCard from '@/components/shared/ArtistCard.vue'

@Component({
  components: {
    ArtistCard,
  },
})
export default class Artists extends Vue {
  @mediaModule.Getter artist
  @mediaModule.Getter artists
  @mediaModule.Getter artistSongs
  @playerModule.Action play
  @queueModule.Action('set') setQueue

  selectedItem = null
  get sortedArtists () {
    return sortBy(this.artists, ['name']).filter(
      artist => artist.albums.length > 0
    )
  }

  get selected () {
    return (
      this.selectedItem ||
      this.artist(this.$route.params.id) ||
      first(this.sortedArtists)
    )
  }
  selectArtist (artist) {
    this.selectedItem = artist
    this.$router.push({ name: 'artists', params: { id: artist.id } })
  }

  onPlay () {
    const songlist = this.artistSongs(this.selected)
    this.setQueue({ songlist, toPlay: songlist[0] })
    this.play()
  }
}
</script>
<style lang="scss">
@import '../../styles/settings';

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
