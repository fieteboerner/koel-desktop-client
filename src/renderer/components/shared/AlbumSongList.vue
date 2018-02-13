<template>
<div class="album-song-list">
  <div v-for="(disc, index) in discs">
    <div class="song-list-item disk-item" v-if="discs.length > 1"><div class="track-name">DISC {{ disc[0].disc }}</div></div>
    <div class="song-list-item" v-for="song in sortSongs(disc)" _class="{'is-selected': isSelected(song) }" @click="selectSong($event, song)">
      <div class="track-number" @click="play(song)"><b-icon icon="play-circle-outline"></b-icon></div>
      <div class="track-number">{{ song.track }}</div>
      <div class="track-name">{{ song.title }}</div>
      <div class="track-favorite"><i class="fa fa-heart-o"></i></div>
      <div class="track-time">{{ song.length | timecode }}</div>
    </div>
  </div>
</div>
</template>
<script>
import { sortBy } from 'lodash'
export default {
  props: {
    album: Object
  },
  computed: {
    discs () {
      let discs = {}
      this.album.songs.forEach(song => {
        if (!discs[song.disc]) discs[song.disc] = []
        discs[song.disc].push(song)
      })

      return sortBy(discs, ['song.disc'])
    }
  },
  methods: {
    sortSongs (songs) {
      return sortBy(songs, ['disc', 'track'])
    }
  }
}
</script>
<style lang="scss">
.album-song-list {
  width: 100%;

  & .song-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #cccccc;
    padding: 7px 0;
  }
  & .song-list-item.is-selected {
    background-color: #2586fa;
    color: white;
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

