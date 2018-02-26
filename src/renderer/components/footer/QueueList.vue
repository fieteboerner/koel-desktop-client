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
						<li v-for="item in prio">
							{{ item.song.title }} - {{ item.song.artist.name }}
						</li>
					</ul>
				</div>
				<div class="title is-5">Next Up</div>
				<ul v-if="queue.length">
					<li v-for="item in queue">
						{{ item.song.title }} - {{ item.song.artist.name }} <a @click="remove(item)">remove</a>
					</li>
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
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('Queue', ['history', 'prio', 'queue', 'currentSong'])
  },
  methods: {
    ...mapActions('Queue', ['remove'])
  }
}
</script>
<style lang="scss" scoped>
// pull footer button right
.modal-card-foot {
	justify-content: flex-end;
}
</style>
