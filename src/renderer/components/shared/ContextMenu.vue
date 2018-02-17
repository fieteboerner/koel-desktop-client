<template>
  <div ref="contextMenu" @click.stop @contextmenu.stop :id="id" :style="ctxStyle" class="dropdown is-active">
		<div style="background-color:transparent" class="dropdown-menu">
      <ul class="dropdown-content">
        <a class="dropdown-item" @click="$emit('play')">Play</a>
        <a class="dropdown-item" @click="$emit('to_queue')">Add to queue</a>
        <hr class="dropdown-divider">
        <a v-if="mainCtx !== 'artist'" class="dropdown-item">Go to artist</a>
        <a v-if="mainCtx !== 'album'" class="dropdown-item">Go to album</a>
        <hr class="dropdown-divider">
        <a class="dropdown-item">Add to playlist</a>
        <a v-if="mainCtx === 'playlist' && subCtx === 'song'" class="dropdown-item">Remove from this playlist</a>
        <hr class="dropdown-divider">
        <a class="dropdown-item">Add to queue</a>    <a class="dropdown-item">Save to disk</a>
        <a class="dropdown-item">Copy share url</a>
      </ul>
		</div>
	</div>
</template>
<script>
import ContextMenu from 'vue-context-menu/src/ctx-menu'
export default {
  extends: ContextMenu,
  props: {
    context: String
  },
  computed: {
    mainCtx () {
      return this.context.split(':')[0]
    },
    subCtx () {
      return this.context.split(':')[1]
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

