<template>
  <ItemList
    :items="artists"
    item-class="sidebar-list-item"
    :item-height="62"
    :selection-context="selectionContext"
    virtual-scroll
    @open="onPlay"
    @select="onSelect"
  >
    <template slot-scope="{ item: artist }">
      <div class="sidebar-item-image">
        <figure class="image is-48x48">
          <img :src="artist.albums[0].cover" :alt="artist.name">
        </figure>
      </div>
      <div class="sidebar-item-content subtitle is-6 truncate">
        {{ artist.name }}
      </div>
    </template>
  </ItemList>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'

import ItemList from '@/components/shared/ItemList.vue'
import { Artist } from '@/interfaces'
import SelectionContext from '@/classes/selection-context'

@Component({
  components: {
    ItemList,
  }
})
export default class ArtistList extends Vue {
  selectionContext: SelectionContext<Artist> = new SelectionContext(false)
  @Prop(Array) artists: Array<Artist>;
  @Prop(Object) value: any;

  onSelect(event: MouseEvent, artist: Artist) {
    this.$emit('select', event, artist)
    this.$emit('input', artist)
  }

  onPlay(event: MouseEvent, artist: Artist) {
    this.$emit('play', artist)
  }

  @Watch('value', { immediate: true })
  onSelectedChange(value) {
    this.$set(this.selectionContext, 'selected', value)
  }

  @Watch('artists', { immediate: true })
  onItemChange(artists) {
    this.$set(this.selectionContext, 'items', artists)
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
