<template>
  <div ref="contextMenu" @click.stop @contextmenu.stop :id="id" :style="ctxStyle" class="dropdown is-active">
    <div style="background-color:transparent" class="dropdown-menu">
      <ul class="dropdown-content">
        <a class="dropdown-item" @click="$emit('play')">Play</a>
        <a class="dropdown-item" @click="queue">Add to queue</a>
        <hr class="dropdown-divider">
        <template v-if="subCtx === 'song' && items.length === 1">
          <a v-if="mainCtx !== 'artist'" @click="goToArtist" class="dropdown-item">Go to artist</a>
          <a v-if="mainCtx !== 'album'"  @click="goToAlbum" class="dropdown-item">Go to album</a>
          <hr class="dropdown-divider">
        </template>
        <a class="dropdown-item">Add to playlist</a>
        <a v-if="mainCtx === 'playlist' && subCtx === 'song'" class="dropdown-item">Remove from this playlist</a>
        <hr class="dropdown-divider">
        <a class="dropdown-item">Save to disk</a>
        <a v-if="subCtx === 'song' && items.length === 1" class="dropdown-item" @click="copyShare">Copy sharable url</a>
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
    context: String,
    items: Array
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
      this.$router.push({ name: 'artists', params: { id: this.firstItem.artist.id } })
    },
    goToAlbum () {
      this.$router.push({ name: 'albums', params: { id: this.firstItem.album.id } })
    },
    queue () {
      if (this.subCtx === 'song') {
        this.queueSongs(this.items)
      }
    },
    copyShare () {
      clipboard.writeText(this.sharableUrl(this.items[0]))
    }
  }
}
</script>
<style lang="scss">
.dropdown {
  position: fixed;

  & .dropdown-menu {
    padding: 0;
  }
}
</style>

