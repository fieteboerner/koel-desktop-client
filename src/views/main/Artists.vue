<template>
  <SidebarLayout>
    <ArtistList
      slot="sidebar"
      :artists="sortedArtists"
      :value="selected"
      @input="onArtistSelect"
      @play="onPlay"
    />
    <div>
      <ArtistCard v-if="selected" :artist="selected" />
      <EmptyListMessage v-else message="No Artists" />
    </div>
  </SidebarLayout>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { first, sortBy } from 'lodash'
import { Getter } from 'vuex-class'
import { mediaModule, playerModule, queueModule } from '@/store/namespaces'
import EmptyListMessage from '@/components/shared/EmptyListMessage.vue'

import ArtistCard from '@/components/shared/ArtistCard.vue'
import ArtistList from '@/components/shared/ArtistList.vue'
import { Artist, Song } from '@/interfaces'

@Component({
  components: {
    ArtistCard,
    ArtistList,
    EmptyListMessage,
  }
})
export default class Artists extends Vue {
  @mediaModule.Getter artist;
  @mediaModule.Getter artists;
  @mediaModule.Getter artistSongs;
  @playerModule.Action play;
  @queueModule.Action('set') setQueue;

  get sortedArtists() {
    return sortBy(this.artists, ['name']).filter(
      artist => artist.albums.length
    )
  }

  get selected(): Artist {
    return (
      this.artist(this.$route.params.id) ||
      first(this.sortedArtists)
    )
  }

  onArtistSelect(artist: Artist) {
    this.$router.push({
      name: 'artists',
      params: { id: artist.id.toString() }
    })
  }

  onPlay() {
    const artist = this.selected
    const songlist: Array<Song> = this.artistSongs(artist)
    this.setQueue({
      songlist,
      toPlay: songlist[0]
    })
    this.play()
  }
}
</script>
