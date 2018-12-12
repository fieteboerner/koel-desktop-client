<template>
    <div class="main-wrapper"
      @keypress.space.prevent="togglePlayback">
      <b-loading :active="isLoading"/>
      <nav class="">
        <div class="navbar">
          <div class="navbar-menu">
            <div class="navbar-end">
              <a class="navbar-item">{{ user.name }}</a>
              <a class="navbar-item" @click="logout"><b-icon icon="exit-to-app"></b-icon></a>
            </div>
          </div>

        </div>
        <div class="tabs is-centered">
          <ul>
            <router-link :to="{name: 'artists'}" tag="li" active-class="is-active"><a>Artists</a></router-link>
            <router-link :to="{name: 'albums'}" tag="li" active-class="is-active"><a>Albums</a></router-link>
            <router-link :to="{name: 'songs'}" tag="li" active-class="is-active"><a>Songs</a></router-link>
            <router-link :to="{name: 'playlists'}" tag="li" active-class="is-active"><a>Playlists</a></router-link>
          </ul>
        </div>
      </nav>
      <div class="main-content">
          <router-view></router-view>
        </div>
      <footer>
        <site-footer></site-footer>
      </footer>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { ipcRenderer } from 'electron'
import { Component } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class';

import SiteFooter from './footer/Index.vue'

@Component({
  components: {
    SiteFooter
  }
})
export default class Main extends Vue {
  @Action('DATA_REQUEST') loadData
  @Getter user
  @Getter('loading') isLoading
  mounted() {
    ipcRenderer.on('media-key', (event, key) => {
      switch (key) {
        case 'playpause':
          this.togglePlayback()
          break
        case 'next':
          this.$store.dispatch('Player/skip')
          break
        case 'previous':
          this.$store.dispatch('Player/back')
          break
      }
    })
  }

  created() {
    this.loadData()
  }

  destroyed() {
    ipcRenderer.removeAllListeners('media-key')
  }

  logout() {
    this.$store.dispatch('AUTH_LOGOUT').then(() => {
      this.$router.push('/login')
    })
  }
  togglePlayback() {
    this.$store.dispatch('Player/toggle')
  }
}
</script>
<style>
html,
body,
#app {
  height: 100%;
  overflow: hidden;
}

.main-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

header {
  flex: 0 0 auto;
}

.main-content {
  flex: 1 1 auto;
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

footer {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #dbdbdb;
}
</style>
