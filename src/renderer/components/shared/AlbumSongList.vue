<template>
<div class="album-song-list">
  <div v-for="(disc, index) in discs">
    <div class="song-list-item disk-item" v-if="discs.length > 1"><div class="track-name">DISC {{ disc[0].disc }}</div></div>
    <div class="song-list-item" v-for="song in sortSongs(disc)" :class="{'is-selected': isSelected(song) }"
      @click.right="$emit('context', $event, song)" @click="$emit('select', $event, song)" @dblclick="$emit('play', song)">
      <div class="track-number" @click="$emit('play', song)"><b-icon icon="play-circle-outline"></b-icon></div>
      <div class="track-number">{{ song.track }}</div>
      <div class="track-name">{{ song.title }}</div>
      <div class="track-favorite"><i class="fa fa-heart-o"></i></div>
      <div class="track-options">
        <a @click.stop="$emit('context', $event, song)"><b-icon icon="dots-horizontal"></b-icon></a>
      </div>
      <div class="track-time">{{ song.length | timecode }}</div>
    </div>
  </div>
</div>
</template>
<script>
import { includes, sortBy } from 'lodash'
export default {
  props: {
    songs: Array,
    selected: Array
  },
  computed: {
    discs () {
      let discs = {}
      this.songs.forEach(song => {
        if (!discs[song.disc]) discs[song.disc] = []
        discs[song.disc].push(song)
      })

      return sortBy(discs)
    }
  },
  methods: {
    sortSongs (songs) {
      return sortBy(songs, ['track'])
    },
    isSelected (song) {
      return includes(this.selected, song)
    }
  }
}
</script>
<style lang="scss">
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
  }
  & .song-list-item.is-selected {
    background-color: #2586fa;
    color: white;

    & .track-name {
      color: white;
    }
  }

  & .song-list-item .track-number {
    width: 2.5rem;
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

