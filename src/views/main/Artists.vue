<template>
  <sidebar-layout>
    <div slot="sidebar">
      <ArtistList
        :artists="sortedArtists"
        :value="selected"
        @input="onArtistSelect"
        @play="onPlay"
      />
    </div>
    <div class="artist-albums">
      <artist-card :artist="selected" v-if="selected"></artist-card>
      <div v-else class="subtitle is-3">No Artists</div>
    </div>
  </sidebar-layout>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { first, sortBy } from "lodash";
import { Getter } from "vuex-class";
import { playerModule, queueModule, mediaModule } from "@/store/namespaces";

import ArtistCard from "@/components/shared/ArtistCard.vue";
import ArtistList from "@/components/shared/ArtistList.vue";
import { Artist, Song } from "@/interfaces";

@Component({
  components: {
    ArtistCard,
    ArtistList,
  }
})
export default class Artists extends Vue {
  @mediaModule.Getter artist;
  @mediaModule.Getter artists;
  @mediaModule.Getter artistSongs;
  @playerModule.Action play;
  @queueModule.Action("set") setQueue;

  get sortedArtists() {
    return sortBy(this.artists, ["name"]).filter(
      artist => artist.albums.length
    );
  }

  get selected() {
    return (
      this.artist(this.$route.params.id) ||
      first(this.sortedArtists)
    );
  }

  onArtistSelect(artist: Artist) {
    this.$router.push({
      name: "artists",
      params: { id: artist.id.toString() }
    });
  }

  onPlay(artist: Artist) {
    const songlist: Array<Song> = this.artistSongs(artist);
    this.setQueue({ songlist, toPlay: songlist[0] });
    this.play();
  }
}
</script>