<template>
  <div class="media footer-root">
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
          <b-icon icon="shuffle"></b-icon>
          <b-icon icon="skip-previous"></b-icon>
          <b-icon v-if="!playing" icon="play-circle-outline" size="is-large" @click.native="resume"></b-icon>
          <b-icon v-else icon="pause-circle-outline" size="is-large" @click.native="pause"></b-icon>
          <b-icon icon="skip-next" @click.native="next"></b-icon>
          <b-icon icon="repeat"></b-icon>
        </div>
      </div>
      <seek-bar></seek-bar>
    </div>
    <div class="media-right special-control">
    </div>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SeekBar from './SeekBar.vue'
export default {
  components: { SeekBar },
  computed: {
    ...mapGetters('Player', ['current', 'playing']),
    currentSong () {
      return this.current
    }
  },
  methods: {
    pause () {
      this.$store.dispatch('Player/pause')
    },
    resume () {
      this.$store.dispatch('Player/resume')
    },
    next () {
      this.$store.dispatch('Player/next')
    }
  }
}
</script>
<style lang="scss">
@import '../../sass/settings';

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
  }

  .buttons {
    margin-bottom: 0;
    width: 250px;
  }

  .special-control {
    width: 250px;
  }
}
</style>