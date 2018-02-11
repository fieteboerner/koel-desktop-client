<template>
    <div class="main-wrapper">
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
        Footer
      </footer>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    logout () {
      this.$store.dispatch('AUTH_LOGOUT').then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>
<style>
html, body, #app {
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
  padding: 0.25rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #dbdbdb;
}
</style>
