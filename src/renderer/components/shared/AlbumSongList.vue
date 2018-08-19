<template>
<div class="album-song-list">
  <div v-for="(disc, index) in discs">
    <div class="song-list-item disk-item" v-if="discs.length > 1"><div class="track-name">DISC {{ disc.number }}</div></div>
    <div class="song-list-item" v-for="song in sortSongs(disc.songs)" :class="{'is-selected': isSelected(song), 'is-current': current === song}"
      @click.right="$emit('context', $event, song)" @click="$emit('select', $event, song)" @dblclick="$emit('play', song)">
      <div class="track-number">
        <div class="show-on-hover">
          <b-icon v-if="current === song && playing" icon="pause-circle-outline" @click.native="pause"></b-icon>
          <b-icon v-else-if="current === song && !playing" icon="play-circle-outline" @click.native="resume"></b-icon>
          <b-icon v-else icon="play-circle-outline" @click.native="$emit('play', song)"></b-icon>
        </div>
        <div class="hide-on-hover">
          <b-icon v-if="current === song && playing" icon="volume-high"></b-icon>
          <b-icon v-else-if="current === song && !playing" icon="volume-low"></b-icon>
          <span v-else>{{ song.track }}</span>
        </div>
        </div>
      <div class="track-name">{{ song.title }}</div>
      <div class="track-options show-on-hover">
        <b-icon icon="dots-horizontal" @click.native="$emit('context', $event, song)" title="more"></b-icon>
      </div>
      <div class="track-time">{{ song.length | timecode }}</div>
    </div>
  </div>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { forOwn, includes, sortBy } from 'lodash'

import { playerModule } from '@/store/namespaces'

@Component
export default class AlbumSongList extends Vue {
   @Prop(Array) songs
   @Prop(Array) selected

   @playerModule.Getter current
   @playerModule.Getter playing

   @playerModule.Action resume
   @playerModule.Action pause

   get discs() {
      let discs = []
      this.songs.forEach(song => {
        if (!discs[song.disc]) discs[song.disc] = []
        discs[song.disc].push(song)
      })

      let discArray = []
      forOwn(discs, (songs, disc) => {
        if (disc === '0') return
        discArray.push({number: disc, songs})
      })

      return sortBy(discArray, ['number'])
   }

  sortSongs (songs) {
    return sortBy(songs, ['track'])
  }

  isSelected (song) {
    return includes(this.selected, song)
  }
}
</script>
<style lang="scss">
@import '../../../sass/settings';
.album-song-list {
  width: 100%;
  cursor: default;
  user-select: none;

  & .song-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #cccccc;
    padding: 7px;
    line-height: 1.75em;
    overflow: hidden;

    .show-on-hover {
      display: none;
    }

    &:hover {
      & .show-on-hover {
        display: block;
      }
      & .hide-on-hover {
        display: none;
      }
    }
  }

  & .song-list-item.is-selected {
    background-color: $cyan;
    color: $white !important;

    & .track-name {
      color: $white !important;
    }
  }

  & .song-list-item.is-current {
    color: $primary;
    & .track-name {
      color: $primary;
    }
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

  & .song-list-item .track-favorite {
    width: 2rem;
  }

  & .song-list-item .track-time {
    text-align: right;
    width: 3rem;
  }
}
</style>

