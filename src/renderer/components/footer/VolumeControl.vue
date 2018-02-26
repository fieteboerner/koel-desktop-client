<template>
	<div id="root">
		<b-icon size="is-small" :max="10" :icon="volumeIcon" @click.native="toggleMute"></b-icon>
		<progress-range :value="volume" @input="setVolume" id="slider"></progress-range>
	</div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import ProgressRange from '@/components/shared/ProgressRange.vue'
export default {
  components: { ProgressRange },
  computed: {
    ...mapGetters('Player', ['muted', 'volume']),
    volumeIcon () {
      return this.volume === 0 ? 'volume-low' : this.volume <= 6 ? 'volume-medium' : 'volume-high'
    }
  },
  methods: {
    ...mapActions('Player', ['setVolume', 'toggleMute'])
  }
}
</script>
<style lang="scss" scoped>
#root {
	width: 125px;
	display: flex;
	align-items: center

}
#slider {
	flex: 1;
}
</style>
