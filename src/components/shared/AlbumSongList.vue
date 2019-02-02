<template>
<div class="album-song-list">
  <div v-for="(disc, index) in discs" :key="index">
    <div class="song-list-item disk-item" v-if="discs.length > 1"><div class="track-name">DISC {{ disc.number }}</div></div>
    <SongList
      :songs="sortSongs(disc.songs)"
      :selection-context="selectionContext"
      @context="onContext"
      @play="onPlay"
    />
  </div>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { forOwn, includes, sortBy } from 'lodash'

import { playerModule } from '@/store/namespaces'
import { Song } from '@/interfaces'
import SongList from './SongList.vue'
import SelectionContext from '@/classes/selection-context';

@Component({
  components: { SongList }
})
export default class AlbumSongList extends Vue {
   @Prop(Array) songs: Song[]
   @Prop(SelectionContext) selectionContext: SelectionContext<Song>

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

  isHighlighted(song) {
    return this.$route.query.highlightedSongId === song.id
  }

  onContext(event: MouseEvent, song: Song = null) {
    this.$emit('context', event, song)
  }

  onPlay(event: MouseEvent|KeyboardEvent, song: Song = null) {
    this.$emit('play', event, song)
  }
}
</script>
<style lang="scss">
@import '../../styles/settings';
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

  & .song-list-item .track-favorite {
    width: 2rem;
  }

  & .song-list-item .track-time {
    text-align: right;
    width: 3rem;
  }
}
</style>

