<template>
<div class="song-list">
  <slot name="header" class="song-list-item"></slot>
  <ItemList
    item-class="song-list-item"
    :items="songs"
    :selected="selected"
    @select="selectItem"
  >
    <ItemListColumn show="track" cell-class="track-number">
      <template slot-scope="{ value, item }">
        <div class="show-on-hover">
          <b-icon v-if="current === item && playing" icon="pause-circle-outline" @click.native="pause" />
          <b-icon v-else-if="current === item && !playing" icon="play-circle-outline" @click.native="resume" />
          <b-icon v-else icon="play-circle-outline" @click.native="$emit('play', item)" />
        </div>
        <div class="hide-on-hover">
          <b-icon v-if="current === item && playing" icon="volume-high" />
          <b-icon v-else-if="current === item && !playing" icon="volume-low" />
          <span v-else>{{ value }}</span>
        </div>
      </template>
    </ItemListColumn>
    <ItemListColumn show="title" cell-class="track-name"></ItemListColumn>
    <ItemListColumn v-if="artist" show="artist" cell-class="track-name">
      <template slot-scope="{ value }">
        {{ value.name }}
      </template>
    </ItemListColumn>
    <ItemListColumn v-if="album" show="album" cell-class="track-name">
      <template slot-scope="{ value }">
        {{ value.name }}
      </template>
    </ItemListColumn>
    <ItemListColumn show="options" cell-class="track-options visible-on-hover">
      <template slot-scope="{ item }">
        <b-icon icon="dots-horizontal" @click.native="$emit('context', $event, item)" title="more" />
      </template>
    </ItemListColumn>
    <ItemListColumn show="length" cell-class="track-time">
      <template slot-scope="{ value }">
        {{ value | timecode }}
      </template>
    </ItemListColumn>
  </ItemList>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { forOwn, includes, sortBy } from 'lodash'

import { playerModule } from '@/store/namespaces'
import ListSelectMixin from '@/mixins/ListSelect'

import ItemList from '@/components/shared/ItemList.vue'
import ItemListColumn from '@/components/shared/ItemListColumn.vue'

@Component({
  components: {
    ItemList,
    ItemListColumn,
  }
})
export default class SongList extends Mixins(ListSelectMixin) {
   @Prop(Array) songs
   @Prop(Array) value
   @Prop(Boolean) artist: Boolean
   @Prop(Boolean) album: Boolean

   @playerModule.Getter current
   @playerModule.Getter playing

   @playerModule.Action resume
   @playerModule.Action pause

    @Watch("value", { immediate: true })
    onSelectedChange(value) {
      this.selected = [value];
    }
}
</script>
<style lang="scss">
@import '../../styles/settings';
.song-list {
  & .song-list-item {
    border-bottom: 1px solid #cccccc;
    padding: 7px;
    line-height: 1.75em;

    .visible-on-hover {
      visibility: hidden;
    }

    .show-on-hover {
      display: none;
    }

    &:hover {
      & .visible-on-hover {
        visibility: visible;
      }

      & .show-on-hover {
        display: block;
      }

      & .hide-on-hover {
        display: none;
      }
    }
  }

  & .song-list-item.is-current {
    color: $primary;
    & .track-name {
      color: $primary;
    }
  }

  & .song-list-item.is-highlighted {
    box-shadow: 0 0 0 3px $primary;
  }

  & .song-list-item .track-number {
    width: 2.5rem;
    text-align: center;
  }
  & .song-list-item .track-name {
    flex: 1;
    color: #010101;
    font-weight: 500;
  }

  & .song-list-item .track-time {
    text-align: right;
    width: 3rem;
  }
}
</style>

