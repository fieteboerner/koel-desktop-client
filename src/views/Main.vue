<template>
  <div
    class="main-wrapper"
    tabindex="-1"
    @keypress.space.prevent="togglePlayback"
    @keyup.ctrl.left="back"
    @keyup.ctrl.right="skip"
  >
    <b-loading :active="isLoading" />
    <nav class="">
      <div class="navbar">
        <div class="navbar-menu">
          <div class="navbar-end">
            <a class="navbar-item" @click.prevent="openProfile">{{ user.name }}</a>
            <a class="navbar-item" @click="logout"><b-icon icon="exit-to-app" /></a>
          </div>
        </div>
      </div>
      <div class="tabs is-centered">
        <ul>
          <router-link :to="{name: 'artists'}" tag="li" active-class="is-active">
            <a>Artists</a>
          </router-link>
          <router-link :to="{name: 'albums'}" tag="li" active-class="is-active">
            <a>Albums</a>
          </router-link>
          <router-link :to="{name: 'songs'}" tag="li" active-class="is-active">
            <a>Songs</a>
          </router-link>
          <router-link :to="{name: 'playlists'}" tag="li" active-class="is-active">
            <a>Playlists</a>
          </router-link>
        </ul>
      </div>
    </nav>
    <div class="main-content">
      <router-view />
    </div>
    <footer>
      <SiteFooter />
    </footer>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { ipcRenderer, shell } from 'electron'
import { Component } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

import { authModule, mediaModule, playerModule } from '@/store/namespaces'
import SiteFooter from '@/components/footer/Index.vue'

@Component({
  components: {
    SiteFooter
  }
})
export default class Main extends Vue {
  @mediaModule.Action loadData
  @playerModule.Action skip
  @playerModule.Action back
  @playerModule.Action togglePlayback
  @authModule.Getter user
  @authModule.Getter url
  @mediaModule.Getter('loading') isLoading

  mounted() {
    ipcRenderer.on('media-key', (event, key) => {
      switch (key) {
      case 'playpause':
        this.togglePlayback()
        break
      case 'next':
        this.skip()
        break
      case 'previous':
        this.back()
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

  openProfile() {
    shell.openExternal(`${this.url}#!/profile`)
  }

  async logout() {
    await this.$store.dispatch('auth/logout')
    this.$router.push('/login')
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
  flex: 1;
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
