<template>
  <div class="artist-card-root" tabindex="-1" @keypress.enter="onPlay">
    <ContextMenu
      ref="ctx"
      context="artist:song"
      :items="selectionContext.sortedSelected"
      @play="onPlay"
    />
    <div>
      <p class="title is-3" style="margin-bottom: 2.25rem;">
        {{ artist.name }}
      </p>
      <p class="subtitle is-5">
        {{ artist.albums.length }} Albums, {{ songCount(artist.albums) }} Songs
      </p>
      <hr>
    </div>
    <div v-for="album in sortedAlbums" :key="album.id" class="artist-card-columns">
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
            <p class="title is-3">
              {{ album.name }}
            </p>
          </div>
          <div class="media-right">
            <i class="fa fa-ellipsis-h" />
          </div>
        </div>
        <hr>
        <AlbumSongList
          :songs="album.songs"
          :selection-context="selectionContext"
          @play="onPlay"
          @context="context"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { sortBy } from 'lodash'
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { mediaModule, playerModule, queueModule } from '@/store/namespaces'

import AlbumSongList from '@/components/shared/AlbumSongList.vue'
import ContextMenu from '@/components/shared/ContextMenu.vue'
import SelectionContext from '@/classes/selection-context'
import { Song } from '@/interfaces'

@Component({
  components: {
    AlbumSongList,
    ContextMenu,
  }
})
export default class ArtistCard extends Vue {
  $refs: { ctx: any }
  selectionContext: SelectionContext<Song> = new SelectionContext(true)
  @Prop(Object) artist
  @mediaModule.Getter albums
  @playerModule.Action play
  @queueModule.Action setQueueBySelection

  get sortedAlbums () {
    return sortBy(this.artist.albums, ['year', 'name'])
  }

  get songList () {
    let songs = []
    this.sortedAlbums.forEach(album => {
      this.sortSongs(album.songs).forEach(song => songs.push(song))
    })
    return songs
  }

  context (event, song) {
    if (!this.selectionContext.isSelected(song)) {
      this.selectionContext.selected = [song]
    }
    this.$refs.ctx.open(event)
  }

  songCount (albums) {
    let count = 0
    albums.forEach(album => {
      count += album.songs.length
    })
    return count
  }

  onPlay() {
    this.setQueueBySelection(this.selectionContext)
    this.play()
  }

  sortSongs (songs) {
    return sortBy(songs, ['disc', 'track'])
  }

  @Watch('songList', { immediate: true })
  onItemChange(songs) {
    this.$set(this.selectionContext, 'items', songs)
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
</style>
