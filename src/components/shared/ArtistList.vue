<template>
  <ItemList
    :items="artists"
    :selected="selected"
    item-class="sidebar-list-item"
    @open="onPlay"
    @select="onSelect"
  >
    <ItemListColumn show="image" cell-class="sidebar-item-image">
      <template slot-scope="{item}">
        <figure class="image is-48x48">
          <img :src="item.albums[0].cover" alt="item.name">
        </figure>
      </template>
    </ItemListColumn>
    <ItemListColumn cell-class="sidebar-item-content is-6 truncate" show="name"/>
  </ItemList>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ListSelectMixin from "@/mixins/ListSelect";

import ItemList from "@/components/shared/ItemList.vue";
import ItemListColumn from "@/components/shared/ItemListColumn.vue";
import { Artist } from "@/interfaces";

@Component({
  components: {
    ItemList,
    ItemListColumn
  }
})
export default class ArtistList extends Mixins(ListSelectMixin) {
  @Prop(Array) artists: Array<Artist>;
  @Prop(Object) value: any;

  get multiselect() {
    return false;
  }

  get items() {
    return this.artists;
  }

  onSelect(event: MouseEvent, item: Artist) {
    this.selectItem(event, item);
    this.$emit("select", event, item);
    this.$emit("input", item);
  }

  onPlay(event: MouseEvent, artist: Artist) {
    this.$emit('play', artist)
  }

  @Watch("value", { immediate: true })
  onSelectedChange(value) {
    this.selected = [value];
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
