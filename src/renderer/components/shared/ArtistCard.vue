<template>
    <div class="artist-card-root"
    @keydown.enter.prevent.stop="handleEnter">
      <div>
        <p class="title is-3" style="margin-bottom: 2.25rem;">{{ artist.name }}</p>
        <p class="subtitle is-5">
          {{ artist.albums.length }} Albums, {{ songCount(artist.albums) }} Songs
        </p>
        <hr>
      </div>
      <div class="artist-card-columns" v-for="album in sortedAlbums">
        <div class="column is-one-quarter is-hidden-touch">
          <figure class="image cover is-square">
            <img :src="album.cover" :alt="album.name">
          </figure>
          <div class="subtitle is-6">
            {{ album.songs.length }} Songs
          </div>
        </div>
        <div class="column">
          <div class="media">
            <div class="media-left is-hidden-desktop">
              <figure class="image cover cover-small is-64x64">
                <img :src="album.cover" :alt="album.name">
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-3">{{ album.name }}</p>
            </div>
            <div class="media-right">
              <i class="fa fa-ellipsis-h"></i>
            </div>
          </div>
          <hr>
          <div class="song-list">
            <div v-for="(disc, index) in disksByAlbum(album)">
              <div class="song-list-item disk-item" v-if="disksByAlbum(album).length > 1"><div class="track-name">DISC {{ disc[0].disc }}</div></div>
              <div class="song-list-item" v-for="song in sortSongs(disc)" :class="{'is-selected': isSelected(song) }" @click="selectSong($event, song)">
                <div class="track-number" @click="play(song)"><b-icon icon="play-circle-outline"></b-icon></div>
                <div class="track-number">{{ song.track }}</div>
                <div class="track-name">{{ song.title }}</div>
                <div class="track-favorite"><i class="fa fa-heart-o"></i></div>
                <div class="track-time">{{ song.length | timecode }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { includes, indexOf, last, sortBy } from 'lodash'

export default {
  props: {
    artist: Object
  },
  data () {
    return {
      selected: []
    }
  },
  computed: {
    ...mapGetters(['albums']),
    sortedAlbums () {
      return sortBy(this.artist.albums, ['year', 'name'])
    },
    songList () {
      let songs = []
      this.sortedAlbums.forEach(album =>
        this.sortSongs(album.songs).forEach(song => songs.push(song))
      )
      return songs
    }
  },
  methods: {
    songCount (albums) {
      let count = 0
      albums.forEach(album => {
        count += album.songs.length
      })
      return count
    },
    disksByAlbum (album) {
      let discs = {}
      album.songs.forEach(song => {
        if (!discs[song.disc]) discs[song.disc] = []
        discs[song.disc].push(song)
      })

      return sortBy(discs, ['song.disc'])
    },
    sortSongs (songs) {
      return sortBy(songs, ['disc', 'track'])
    },
    play (song) {
      let found = false
      const songs = this.songList.filter(s => {
        if (found) return true
        if (s !== song) return false
        found = true
        return true
      })
      this.$store.dispatch('Player/play', songs)
    },
    selectSong (event, song) {
      console.log(event)
      if (event.ctrlKey) {
        this.selected.push(song)
      } else if (this.selected.length && event.shiftKey) {
        let indexes = sortBy([
          indexOf(this.songList, last(this.selected)),
          indexOf(this.songList, song)
        ])

        for (let i = indexes[0]; i <= indexes[1]; i++) {
          this.selected.push(this.songList[i])
        }
      } else {
        this.selected = [song]
      }
    },
    isSelected (song) {
      return includes(this.selected, song)
    },
    handleEnter () {
      console.log('enter')
    }
  }
}
</script>
<style>
.artist-card-root {
  padding: 1em;
}

.cover img {
  border-radius: 2%;
  border: 1px solid #cccccc;
}

.cover-small img {
  border-radius: 4%;
}

.artist-card-columns {
  display: flex;
  flex-direction: row;
}

.media-content {
  overflow: hidden;
}

.song-list {
  width: 100%;
}

.song-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #cccccc;
  padding: 7px 0;
}
.song-list-item.is-selected {
  background-color: #2586fa;
  color: white;
}

.song-list-item .track-number {
  width: 2.5rem;
}
.song-list-item .track-name {
  flex: 1;
  color: #010101;
  font-weight: 500;
}

.song-list-item .track-favorite {
  width: 2rem;
}

.song-list-item .track-time {
  text-align: right;
  width: 3rem;
}
</style>
