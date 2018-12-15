<template>
  <div class="footer-root" tabindex="-1">
    <div class="current-song">
      <template v-if="currentSong">
        <figure class="current-song-cover image is-48x48">
          <img :src="currentSong.album.cover" :alt="currentSong.title">
        </figure>
        <div class="current-song-content">
          <p class="title is-6">{{ currentSong.title }}</p>
          <p class="subtitle is-7" @click="goToArtist">
            {{ currentSong.artist.name }}
          </p>
        </div>
      </template>
    </div>
    <div class="controls-wrapper timeline">
      <div class="controls">
        <div class="buttons level">
          <b-icon icon="shuffle" :class="{active: shuffle}" @click.native="toggleShuffle"></b-icon>
          <b-icon icon="skip-previous" @click.native="back"></b-icon>
          <b-icon v-if="!playing" icon="play-circle-outline" size="is-large" @click.native="resume"></b-icon>
          <b-icon v-else icon="pause-circle-outline" size="is-large" @click.native="pause"></b-icon>
          <b-icon icon="skip-next" @click.native="skip"></b-icon>
          <b-icon :icon="repeatIcon" :class="{active: ['ONE', 'ALL'].indexOf(repeat) > -1}" @click.native="toggleRepeat"></b-icon>
        </div>
      </div>
      <seek-bar></seek-bar>
    </div>
    <div class="special-control">
      <b-icon icon="playlist-play" @click.native="queueListActive = true"></b-icon>
      <b-modal :active.sync="queueListActive">
        <queue-list></queue-list>
      </b-modal>
      <volume-control></volume-control>
    </div>

  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import QueueList from './QueueList.vue'
import SeekBar from './SeekBar.vue'
import VolumeControl from './VolumeControl.vue'
import { playerModule } from '@/store/namespaces'

@Component({
  components: {
    QueueList,
    SeekBar,
    VolumeControl,
  }
})
export default class Index extends Vue {
  queueListActive = false
  @playerModule.Action back
  @playerModule.Action pause
  @playerModule.Action resume
  @playerModule.Action skip

  @playerModule.Getter('current') currentSong
  @playerModule.Getter playing
  @playerModule.Getter repeat
  @playerModule.Getter shuffle

  @playerModule.Mutation toggleRepeat
  @playerModule.Mutation toggleShuffle

  get repeatIcon() {
    return this.repeat === 'ONE' ? 'repeat-once' : 'repeat'
  }

  goToArtist(){
    this.$router.push({
      name: 'artists',
      params: { id: this.currentSong.artist.id }
    })
  }
}
</script>
<style lang="scss">
@import '../../../sass/settings';

.footer-root {
  flex: 1;
  display: flex;
  height: 75px;
  align-items: center;
  user-select: none;
  cursor: default;

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

      .subtitle:hover {
        text-decoration: underline;
      }
    }
  }

  .controls-wrapper {
    flex: 1;
  }

  .controls {
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .buttons {
    margin-bottom: 0;
    width: 250px;

    & .active {
      color: $primary;
    }
  }

  .buttons {
    margin-bottom: 0;
    width: 250px;
  }

  .special-control {
    width: 350px;
    display: flex;
    margin: 0 1.5rem 0 1rem;
    justify-content: flex-end;

    >.icon {
      margin-right: 0.75rem;
    }
  }
}
</style>