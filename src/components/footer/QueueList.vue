<template>
<div class="modal-card" style="width: auto;">
	<header class="modal-card-head">
		<div class="modal-card-title">Play Queue</div>
  </header>
	<section class="modal-card-body">
		<b-tabs position="is-centered">
			<b-tab-item label="Queue">
				<div class="title is-5">Now Playing</div>
				{{ currentSong ? currentSong.title : '-' }}

				<div v-if="prio.length">
					<div class="title is-5">Next in Queue</div>
					<ul>
						<draggable :value="prio" @input="onPrioSort" :options="{group:'queue'}">
							<li v-for="item in prio" :key="item.id">
								{{ item.song.title }} - {{ item.song.artist.name }}
							</li>
						</draggable>
					</ul>
				</div>
				<div class="title is-5">Next Up</div>
				<ul v-if="queue.length">
					<draggable :value="queue" @input="onQueueSort" :options="{group:'queue'}">
						<li v-for="item in queue" :key="item.id">
							{{ item.song.title }} - {{ item.song.artist.name }} <a @click="remove(item)">remove</a>
						</li>
					</draggable>
				</ul>
				<div v-else class="has-text-centered subtitle is-5">No items</div>

			</b-tab-item>
			<b-tab-item label="History">
				<ul v-if="history.length">
					<li v-for="historyItem in history" :key="historyItem.id">
						{{ historyItem.playStart }} - {{ historyItem.song.title }}
					</li>
				</ul>
				<div v-else class="has-text-centered subtitle is-5">No items</div>
			</b-tab-item>
		</b-tabs>
	</section>
	<footer class="modal-card-foot">
		<button class="button is-primary" @click="$parent.close">OK</button>
	</footer>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { queueModule } from '@/store/namespaces'

import draggable from 'vuedraggable'


@Component({
  components: {
    draggable
  },
})
export default class QueueList extends Vue {
  @queueModule.Action remove

  @queueModule.Getter history
  @queueModule.Getter prio
  @queueModule.Getter queue
  @queueModule.Getter currentSong

  @queueModule.Mutation('sort') queueSort

  get queueList() {
    return this.prio.concat(this.queue)
  }

  onPrioSort (queue) {
    this.queueSort({prio: true, queueItems: queue})
  }

  onQueueSort (queue) {
    this.queueSort({prio: false, queueItems: queue})
  }
}
</script>
<style lang="scss" scoped>
// pull footer button right
.modal-card-foot {
  justify-content: flex-end;
}
</style>
