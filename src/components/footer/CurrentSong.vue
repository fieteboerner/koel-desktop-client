<template>
  <div v-if="currentSong" class="current-song">
    <figure class="current-song-cover image is-48x48">
      <img :src="currentSong.album.cover" :alt="currentSong.title">
    </figure>
    <div class="current-song-content">
      <p class="title is-6">
        <span class="title-text" @click="goToAlbum">{{ currentSong.title }}</span>
        <b-icon
          :class="{ liked: currentSongLiked }"
          class="title-favorite"
          :icon="likeIcon"
          @click="toggleFavorite"
        />
      </p>
      <p class="subtitle is-7" @click="goToArtist">{{ currentSong.artist.name }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import { playerModule } from "@/store/namespaces";
import { Song } from "@/interfaces";

@Component
export default class CurrentSong extends Vue {
  @playerModule.Getter("current") currentSong;

  get currentSongLiked() {
    const currentSong: Song = this.currentSong || {};

    return !!currentSong.liked;
  }

  get likeIcon() {
    return this.currentSongLiked ? "heart" : "heart-outline";
  }

  toggleFavorite() {}

  goToArtist() {
    this.$router.push({
      name: "artists",
      params: { id: this.currentSong.artist.id }
    });
  }

  goToAlbum() {
    this.$router.push({
      name: "albums",
      params: { id: this.currentSong.album.id },
      query: { highlightedSongId: this.currentSong.id }
    });
  }
}
</script>

<style lang="scss">
@import '../../styles/settings';
.current-song {
  display: flex;
  width: 350px;
  margin: 0 1rem;
  align-items: center;

  .current-song-cover {
    margin-right: 1rem;
  }

  .current-song-content {
    overflow: hidden;

    .title-favorite {
      margin-left: 5px;
      cursor: pointer;

      &.liked {
        color: $danger;
      }
    }

    .title-text,
    .subtitle {
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>

