<template>
  <div class="full-seek-bar">
    <div class="current-time">{{ duration | timecode }}</div>
    <div ref="plyr" class="plyr" id="plyr-player">
      <audio ref="audio" controls></audio>
    </div>
    <div class="full-time" @click="showTimeLeft = !showTimeLeft">{{ showTimeLeft ? timeLeft : currentTime | timecode }}</div>
  </div>
</template>
<script>
import 'plyr/dist/plyr.css'
import { mapGetters } from 'vuex'
export default {
  mounted () {
    this.$store.dispatch('Player/init', this.$refs.audio)
  },
  data () {
    return {
      showTimeLeft: false
    }
  },
  computed: {
    ...mapGetters('Player', ['current', 'duration', 'currentTime']),
    timeLeft () {
      return -1 * (this.duration - this.currentTime)
    }
  }
}
</script>
<style lang="scss">
@import "../../sass/settings";
.full-seek-bar {
  display: flex;
  align-items: center;
  flex-direction: row;
  font-size: $size-7;
}
.current-time {
  padding-right: 7px;
}
.full-time {
  padding-left: 7px;
}
.plyr {
  flex: 1;
  position: relative;
}

.plyr--audio .plyr__controls {
  border: none;
  background: inherit;
  color: inherit;
  padding: 0 3px;
}

.plyr__sr-only,
.plyr__tooltip {
  display: none;
}

.plyr__progress {
  display: inline-block;
}

.plyr__progress input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffffff;
}

.plyr__progress--played {
  color: $primary;
}

.plyr__progress--buffer,
.plyr__progress--played,
.plyr__volume--display {
  height: 4px;
  padding: 0;
}
</style>
