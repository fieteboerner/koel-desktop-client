<template>
  <SingleLayout>
    <div
      v-if="sortedAlbums.length"
      v-infinite-scroll="infiniteHandler"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="100"
      class="cover-container"
      tabindex="-1"
      @click.self="deselect"
      @keyup.esc="deselect"
    >
      <template v-for="album in infiniteAlbums">
        <CoverTile
          :key="album.id"
          :img="album.cover"
          :title="album.name"
          :subtitle="album.artist.name"
          :class="{'is-selected': selected === album}"
          class="album-item"
          @cover="selectAlbum(album)"
          @title="selectAlbum(album)"
          @subtitle="$router.push({name: 'artists', params: {id: album.artist.id}})"
        />
        <transition
          :key="album.id"
          name="detail-toggle"
          @after-enter="scrollToSelected"
          @appear="scrollToSelected"
        >
          <div v-if="selected === album" class="details">
            <AlbumCard :album="album" />
          </div>
        </transition>
      </template>
    </div>
    <EmptyListMessage v-else message="No Albums" />
  </SingleLayout>
</template>
<script lang="ts">
import Vue from 'vue'
import { Getter } from 'vuex-class'
import { sortBy, take } from 'lodash'
import { Component } from 'vue-property-decorator'
import VueScrollto from 'vue-scrollto'

import { mediaModule } from '@/store/namespaces'
import CoverTile from '@/components/shared/CoverTile.vue'
import AlbumCard from '@/components/shared/AlbumCard.vue'
import EmptyListMessage from '@/components/shared/EmptyListMessage.vue'

@Component({
  components: {
    AlbumCard,
    CoverTile,
    EmptyListMessage,
  },
})
export default class Albums extends Vue {

  @mediaModule.Getter album
  @mediaModule.Getter albums

  busy = false
  items = 250

  get sortedAlbums () {
    return sortBy(this.albums, ['artist.name', 'name'])
  }

  get infiniteAlbums () {
    return take(this.sortedAlbums, this.items)
  }

  get selected () {
    return this.album(this.$route.params.id)
  }

  infiniteHandler () {
    this.busy = true
    this.items += 250
    this.busy = false
  }

  selectAlbum (album) {
    if (this.selected !== album) {
      this.$router.push({
        name: 'albums',
        params: { id: album.id } 
      })
    } else {
      this.deselect()
    }
  }

  deselect () {
    this.$router.push({ name: 'albums' })
  }

  scrollToSelected () {
    VueScrollto.scrollTo('.details', 500, {
      container: '.main-content',
      offset: -150 
    })
  }
}
</script>
<style lang="scss">
@import "~@/styles/settings";

.cover-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(325px, 1fr));
  grid-gap: 1em;
  grid-auto-flow: row dense;

  & .album-item.is-selected::after {
    content: '';
    position: absolute;
    left: 42%;
    top: calc(100% + 1em);
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 20px solid $light;
  }

  & .details {
    background-color: $light;
    grid-column: 1 / -1;
    margin: 1em -1em 0;
    padding: 1em;
    overflow: hidden;
  }
}

.detail-toggle-enter-active {
  transition: height 0.3s;
}
.detail-toggle-enter-active {
  height: auto;
}
.detail-toggle-enter,
.detail-toggle-leave,
.detail-toggle-leave-active {
  height: 0;
}
</style>
