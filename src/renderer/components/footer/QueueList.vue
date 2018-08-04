<template>
<div class="modal-card" style="width: auto;">
	<header class="modal-card-head">
		<div class="modal-card-title">Play Queue</div></header>
	<section class="modal-card-body">
		<b-tabs position="is-centered">
			<b-tab-item label="Queue">
				<div class="title is-5">Now Playing</div>
				{{ currentSong ? currentSong.title : '-' }}

				<div v-if="prio.length">
					<div class="title is-5">Next in Queue</div>
					<ul>
						<draggable :value="prio" @input="onPrioSort" :options="{group:'queue'}">
							<li v-for="item in prio">
								{{ item.song.title }} - {{ item.song.artist.name }}
							</li>
						</draggable>
					</ul>
				</div>
				<div class="title is-5">Next Up</div>
				<ul v-if="queue.length">
					<draggable :value="queue" @input="onQueueSort" :options="{group:'queue'}">
						<li v-for="item in queue">
							{{ item.song.title }} - {{ item.song.artist.name }} <a @click="remove(item)">remove</a>
						</li>
					</draggable>
				</ul>
				<div v-else class="has-text-centered subtitle is-5">No items</div>

			</b-tab-item>
			<b-tab-item label="History">
				<ul v-if="history.length">
					<li v-for="historyItem in history">
						{{ historyItem.play_start }} - {{ historyItem.song.title }}
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
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  computed: {
    ...mapGetters('Queue', ['history', 'prio', 'queue', 'currentSong']),
    queueList () {
      return this.prio.concat(this.queue)
    }
  },
  methods: {
    ...mapMutations('Queue', { queueSort: 'QUEUE_SORT' }),
    ...mapActions('Queue', ['remove']),
    onPrioSort (queue) {
      this.queueSort({prio: true, queueItems: queue})
    },
    onQueueSort (queue) {
      this.queueSort({prio: false, queueItems: queue})
    }
  }
}
</script>
<style lang="scss" scoped>
// pull footer button right
.modal-card-foot {
	justify-content: flex-end;
}
</style>
