<template>
  <div class="media footer-root" tabindex="-1">
    <div class="media-left current-song">
      <div v-if="currentSong" class="media">
        <figure class="media-left image is-48x48">
          <img :src="currentSong.album.cover" :alt="currentSong.title">
        </figure>
        <div class="media-content">
          <p class="title is-5">{{ currentSong.title }}</p>
          <p class="subtitle is-6">{{ currentSong.artist.name }}</p>
        </div>
      </div>
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
    <div class="media-right special-control">
      <b-icon icon="playlist-play" @click.native="queueListActive = true"></b-icon>
      <b-modal :active.sync="queueListActive">
        <queue-list></queue-list>
      </b-modal>
      <volume-control></volume-control>
    </div>

  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import QueueList from './QueueList.vue'
import SeekBar from './SeekBar.vue'
import VolumeControl from './VolumeControl.vue'
export default {
  components: { VolumeControl, QueueList, SeekBar },
  data () {
    return {
      queueListActive: false
    }
  },
  computed: {
    ...mapGetters('Player', ['current', 'playing', 'repeat', 'shuffle']),
    currentSong () {
      return this.current
    },
    repeatIcon () {
      return this.repeat === 'ONE' ? 'repeat-once' : 'repeat'
    }
  },
  methods: {
    ...mapActions('Player', ['back', 'pause', 'resume', 'skip']),
    toggleRepeat () {
      this.$store.commit('Player/PLAYER_TOGGLE_REPEAT')
    },
    toggleShuffle () {
      this.$store.commit('Player/PLAYER_SHUFFLE')
    }
  }
}
</script>
<style lang="scss">
@import '../../../sass/settings';

.footer-root {
  flex: 1;
  height: 70px;

  .current-song {
    padding-left: 0.75rem;
    width: 350px;
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
    width: 250px;
    display: flex;
    padding: 1em 0;
  }
}
</style>