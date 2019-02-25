<template>
  <div v-if="currentSong" class="current-song">
    <figure class="current-song-cover image is-48x48">
      <img :src="currentSong.album.cover" :alt="currentSong.title">
    </figure>
    <div class="current-song-content">
      <div class="title is-6">
        <router-link :to="albumRoute" class="title-text" tag="span">{{ currentSong.title }}</router-link>
        <b-icon
          :class="{ liked: currentSongLiked }"
          class="title-like"
          :icon="likeIcon"
          @click.native="toggleLike(currentSong)"
        />
      </div>
      <router-link :to="artistRoute" class="subtitle is-7" tag="div">
        {{ currentSong.artist.name }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import { mediaModule, playerModule } from "@/store/namespaces";
import { Song } from "@/interfaces";

@Component
export default class CurrentSong extends Vue {
  @playerModule.Getter("current") currentSong: Song|null
  @mediaModule.Getter isSongLiked: Function
  @mediaModule.Action toggleLike

  get currentSongLiked() {
    return this.isSongLiked(this.currentSong)
  }

  get likeIcon() {
    return this.currentSongLiked ? "heart" : "heart-outline";
  }

  get artistRoute() {
    return {
      name: "artists",
      params: { id: this.currentSong.artist.id }
    }
  }

  get albumRoute() {
    return {
      name: "albums",
      params: { id: this.currentSong.album.id },
      query: { highlightedSongId: this.currentSong.id }
    }
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

    .title-like {
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

