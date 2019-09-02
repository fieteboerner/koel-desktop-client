<template>
  <div class="volume-control">
    <b-icon size="is-small" :icon="volumeIcon" @click.native="toggleMute" />
    <progress-range :value="volume" :max="10" :step=".1" @input="onUpdateVolume" class="volume-control-slider" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { playerModule } from '@/store/namespaces'
import ProgressRange from '@/components/shared/ProgressRange.vue'

@Component({
  components: {
    ProgressRange,
  },
})
export default class VolumeControl extends Vue {
  @playerModule.Action setVolume
  @playerModule.Action toggleMute

  @playerModule.Getter muted
  @playerModule.Getter volume

  get volumeIcon() {
    if(this.volume === 0) {
      return 'volume-low'
    }
    if(this.volume <= 6) {
      return 'volume-medium'
    }

    return 'volume-high'
  }

  onUpdateVolume(value) {
    this.setVolume(Math.round(value))
  }
}
</script>
<style lang="scss" scoped>
.volume-control {
	width: 125px;
	display: flex;
	align-items: center;

  .volume-control-slider {
    flex: 1;
    margin-left: 0.25rem;
  }
}
</style>
