<template>
  <div class="modal-card" style="width: auto;">
    <header class="modal-card-head">
      <div class="modal-card-title">
        Play Queue
      </div>
    </header>
    <section class="modal-card-body">
      <b-tabs position="is-centered">
        <b-tab-item label="Queue">
          <div v-if="currentSong">
            <div class="list-title">
              <h2 class="title is-5">
                Now Playing
              </h2>
            </div>
            <SongList
              :songs="[currentSong]"
              :selection-context="selectionContext"
              album
              artist
            />
          </div>
          <div v-else class="has-text-centered subtitle is-5">
            Nothing to play
          </div>

          <div v-if="prioSongs.length">
            <div class="list-title">
              <h2 class="title is-5">
                Next in Queue
              </h2>
              <button class="button is-light">
                Clear
              </button>
            </div>
            <SongList
              v-if="prioSongs.length"
              :songs="prioSongs"
              :selection-context="selectionContext"
              album
              artist
            />
            <!-- <ul>
						<draggable :value="prio" @input="onPrioSort" :options="{group:'queue'}">
							<li v-for="item in prio" :key="item.id">
								{{ item.song.title }} - {{ item.song.artist.name }}
							</li>
						</draggable>
            </ul>-->
          </div>
          <div v-if="queueSongs.length">
            <div class="list-title">
              <h2 class="title is-5">
                Next Up
              </h2>
            </div>
            <SongList
              :songs="queueSongsToShow"
              :selection-context="selectionContext"
              :class="{ 'fade-out': moreQueueSongsToShow }"
              album
              artist
            />
          </div>
          <!-- <ul v-if="queue.length">
					<draggable :value="queue" @input="onQueueSort" :options="{group:'queue'}">
						<li v-for="item in queue" :key="item.id">
							{{ item.song.title }} - {{ item.song.artist.name }} <a @click="remove(item)">remove</a>
						</li>
					</draggable>
          </ul>-->
        </b-tab-item>
        <b-tab-item label="History">
          <SongList
            v-if="historySongs.length"
            :songs="historySongs"
            album
            artist
          />
          <div v-else class="has-text-centered subtitle is-5">
            No items
          </div>
        </b-tab-item>
      </b-tabs>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-primary" @click="$parent.close">
        Close
      </button>
    </footer>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { take, sortBy } from 'lodash'
import { Component, Watch } from 'vue-property-decorator'
import { queueModule } from '@/store/namespaces'
import SongList from '@/components/shared/SongList.vue'
import { MAX_SHOW_QUEUE_ITEMS } from '@/config/queue'

import draggable from 'vuedraggable'
import { QueueItem, Song } from '@/interfaces'
import SelectionContext from '@/classes/selection-context'

@Component({
  components: {
    draggable,
    SongList
  }
})
export default class QueueList extends Vue {
  selectionContext: SelectionContext<Song> = new SelectionContext(true);
  @queueModule.Action remove;

  @queueModule.Getter history;
  @queueModule.Getter prio;
  @queueModule.Getter queue;
  @queueModule.Getter currentSong;

  @queueModule.Mutation('sort') queueSort;

  get queueList(): Song[] {
    return [this.currentSong, ...this.prioSongs, ...this.queueSongs]
  }

  get prioSongs(): Song[] {
    return this.prio.map((queueItem: QueueItem) => queueItem.song)
  }

  get queueSongs(): Song[] {
    return this.queue.map((queueItem: QueueItem) => queueItem.song)
  }

  get historySongs(): Song[] {
    return this.history.map((queueItem: QueueItem) => queueItem.song).reverse()
  }

  get queueSongsToShow(): Song[] {
    return take(this.queueSongs, MAX_SHOW_QUEUE_ITEMS)
  }

  get moreQueueSongsToShow(): boolean {
    return this.queueSongs.length > MAX_SHOW_QUEUE_ITEMS
  }

  onPrioSort(queue) {
    this.queueSort({
      prio: true,
      queueItems: queue
    })
  }

  onQueueSort(queue) {
    this.queueSort({
      prio: false,
      queueItems: queue
    })
  }

  @Watch('queueList', { immediate: true })
  onQueueListChange(songs) {
    this.selectionContext.items = songs
  }
}
</script>
<style lang="scss" scoped>
// pull footer button right
.modal-card-foot {
  justify-content: flex-end;
}

.list-title {
  .title {
    margin-bottom: 0;
  }

  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  margin-top: 2rem;
}

.fade-out {
  position: relative;

  &::after {
    background-image: linear-gradient(transparent, white);
    bottom: 0;
    content: '';
    height: 20em;
    pointer-events: none;
    position: absolute;
    width: 100%;
  }
}
</style>
