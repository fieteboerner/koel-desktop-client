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
    <template slot-scope="item">
      <div class="sidebar-item-image">
        <figure class="image is-48x48">
          <!-- <img v-if="!item.isFavorite" :src="item.cover" alt="item.name"> -->
          <b-icon
            class="liked-icon"
            :icon="item.isFavorite ? 'heart' : 'file'"
          />
        </figure>
      </div>
      <div class="sidebar-item-content subtitle is-6 truncate">{{ item.name }}</div>
    </template>
  </ItemList>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";

import ItemList from "@/components/shared/ItemList.vue";
import { Playlist, Song } from "@/interfaces";
import SelectionContext from "@/classes/selection-context";

@Component({
  components: {
    ItemList
  }
})
export default class PlaylistList extends Vue {
  selectionContext: SelectionContext<Playlist> = new SelectionContext(false);
  @Prop(Array) playlists: Playlist[];
  @Prop(Object) value: Playlist;

  onSelect(event: MouseEvent, playlist: Playlist) {
    this.$emit("select", event, playlist);
    this.$emit("input", playlist);
  }

  onPlay(event: MouseEvent, playlist: Playlist) {
    this.$emit("play", playlist);
  }

  @Watch("value", { immediate: true })
  onSelectedChange(value) {
    this.$set(this.selectionContext, "selected", value);
  }
}
</script>

<style lang="scss">
.sidebar-list-item {
  padding: 7px 10px;

  .sidebar-item-image img {
    height: 100%;
    border-radius: 50%;
  }

  .sidebar-item-content {
    flex: 1;
    padding-left: 1em;
    padding-right: 1em;
  }
}
</style>
