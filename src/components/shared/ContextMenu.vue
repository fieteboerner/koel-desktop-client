<template>
  <div
    :id="id"
    ref="contextMenu"
    :style="ctxStyle"
    class="dropdown is-active"
    @click.stop
    @contextmenu.stop
  >
    <div style="background-color:transparent" class="dropdown-menu">
      <ul class="dropdown-content">
        <a class="dropdown-item" @click="$emit('play')">Play</a>
        <a class="dropdown-item" @click="queue">Add to Queue</a>
        <hr class="dropdown-divider">
        <template v-if="subCtx === 'song' && items.length === 1">
          <a v-if="mainCtx !== 'artist'" class="dropdown-item" @click="goToArtist">Go to Artist</a>
          <a v-if="mainCtx !== 'album'" class="dropdown-item" @click="goToAlbum">Go to Album</a>
          <hr class="dropdown-divider">
        </template>
        <a class="dropdown-item">Add to Playlist</a>
        <a
          v-if="mainCtx === 'playlist' && subCtx === 'song'"
          class="dropdown-item"
          @click="onRemove"
        >Remove from this Playlist</a>
        <hr class="dropdown-divider">
        <a class="dropdown-item">Save to Disk</a>
        <a v-if="subCtx === 'song' && items.length === 1" class="dropdown-item" @click="copyShare">Copy sharable URL</a>
      </ul>
    </div>
  </div>
</template>
<script>
import { clipboard } from 'electron'
import { mapActions, mapGetters } from 'vuex'
import ContextMenu from 'vue-context-menu/src/ctx-menu'
export default {
  extends: ContextMenu,
  props: {
    context: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters('media', ['sharableUrl']),
    mainCtx () {
      return this.context.split(':')[0]
    },
    subCtx () {
      return this.context.split(':')[1]
    },
    firstItem () {
      return this.items[0]
    }
  },
  methods: {
    ...mapActions('queue', { queueSongs: 'queue' }),
    goToArtist () {
      this.$router.push({
        name: 'artists',
        params: { id: this.firstItem.artist.id }
      })
    },
    goToAlbum () {
      this.$router.push({
        name: 'albums',
        params: { id: this.firstItem.album.id }
      })
    },
    queue () {
      if (this.subCtx === 'song') {
        this.queueSongs(this.items)
      }
    },
    copyShare () {
      clipboard.writeText(this.sharableUrl(this.items[0]))
    },
    onRemove() {
      this.$emit('remove')
    }
  }
}
</script>
<style lang="scss">
.dropdown {
  position: fixed;
  z-index: 1;

  & .dropdown-menu {
    padding: 0;
  }
}
</style>

