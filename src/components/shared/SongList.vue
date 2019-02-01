<template>
<div class="song-list">
  <slot name="header" class="song-list-item"></slot>
  <ItemList
    item-class="song-list-item"
    :items="songs"
    :selected="selected"
    :itemHeight="42"
    virtualScroll
    @select="selectItem"
  >
    <template slot-scope="item">
      <div class="track-number">
          <div class="show-on-hover">
            <b-icon v-if="current === item && playing" icon="pause-circle-outline" @click.native="pause" />
            <b-icon v-else-if="current === item && !playing" icon="play-circle-outline" @click.native="resume" />
            <b-icon v-else icon="play-circle-outline" @click.native="$emit('play', item)" />
          </div>
          <div class="hide-on-hover">
            <b-icon v-if="current === item && playing" icon="volume-high" />
            <b-icon v-else-if="current === item && !playing" icon="volume-low" />
            <span v-else>{{ item.track }}</span>
          </div>
      </div>
      <div class="track-name">{{ item.title }}</div>
      <div v-if="artist" class="track-name">{{ item.artist.name }}</div>
      <div v-if="album" class="track-name">{{ item.album.name }}</div>
      <div class="track-options visible-on-hover">
        <b-icon icon="dots-horizontal" @click.native="$emit('context', $event, item)" title="more" />
      </div>
      <div class="track-time">{{ item.length | timecode }}</div>
    </template>
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

@Component({
  components: {
    ItemList,
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
  height: 100%;
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
    padding-right: 0.2rem;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .song-list-item .track-time {
    text-align: right;
    width: 3rem;
  }
}
</style>

