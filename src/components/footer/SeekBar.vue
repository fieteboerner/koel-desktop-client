<template>
  <div class="full-seek-bar">
    <div class="current-time">
      {{ duration | timecode }}
    </div>
    <div id="plyr-player" ref="plyr" class="plyr">
      <audio ref="audio" controls />
    </div>
    <div class="full-time" @click="toggleShowRemainingTime">
      {{ showRemainingTime ? timeLeft : currentTime | timecode }}
    </div>
  </div>
</template>
<script lang="ts">
import 'plyr/dist/plyr.css'

import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { playerModule } from '@/store/namespaces'

@Component
export default class SeekBar extends Vue {
  @playerModule.Action init
  @playerModule.Action destroy
  @playerModule.Action toggleShowRemainingTime

  @playerModule.Getter current
  @playerModule.Getter currentTime
  @playerModule.Getter showRemainingTime

  showTimeLeft = false

  mounted() {
    this.init()
  }

  destroyed() {
    this.destroy()
  }

  get duration() {
    if (!this.current) return 0
    return this.current.length
  }

  get timeLeft() {
    return -1 * (this.duration - this.currentTime)
  }
}
</script>
<style lang="scss">
@import "../../styles/settings";
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
