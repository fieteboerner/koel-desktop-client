<template>
  <ItemList
    :items="playlists"
    item-class="sidebar-list-item"
    :item-height="62"
    :selection-context="selectionContext"
    virtual-scroll
    @open="onPlay"
    @select="onSelect"
  >
    <template slot-scope="{ item: playlist }">
      <div class="sidebar-item-image">
        <figure class="image is-48x48 icon-image">
          <b-icon
            class="liked-icon"
            :icon="playlist.isFavorite ? 'heart' : 'playlist-music'"
          />
        </figure>
      </div>
      <div class="sidebar-item-content subtitle is-6 truncate">
        {{ playlist.name }}
      </div>
    </template>
  </ItemList>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'

import ItemList from '@/components/shared/ItemList.vue'
import { Playlist, Song } from '@/interfaces'
import SelectionContext from '@/classes/selection-context'

@Component({
  components: {
    ItemList
  }
})
export default class PlaylistList extends Vue {
  selectionContext: SelectionContext<Playlist> = new SelectionContext(false);
  @Prop(Array) playlists: Playlist[];
  @Prop(Object) value: Playlist;

  onSelect() {
    const playlist = this.selectionContext.firstSortedSelected
    this.$emit('input', playlist)
  }

  onPlay() {
    this.$emit('play')
  }

  @Watch('playlists', { immediate: true })
  onPlaylistsChange(playlists) {
    this.selectionContext.items = playlists
  }

  @Watch('value', { immediate: true })
  onSelectedChange(value) {
    this.$set(this.selectionContext, 'selected', value)
  }
}
</script>

<style lang="scss">
@import "~@/styles/settings";

.sidebar-list-item {
  padding: 7px 10px;

  .sidebar-item-image {
    .icon-image {
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 0 3px $text;
      box-shadow: inset 0 0 0 3px;
      border-radius: 50%;
    }
  }

  .sidebar-item-content {
    flex: 1;
    padding-left: 1em;
    padding-right: 1em;
  }
}
</style>
