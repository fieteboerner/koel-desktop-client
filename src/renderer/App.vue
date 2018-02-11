<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'koel-desktop-client',
  created () {
    axios.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          // if you ever get an unauthorized, logout the user
          this.$store.dispatch('AUTH_LOGOUT')
          this.$router.push('/login')
        }
        throw err
      })
    })
  }
}
</script>
<style lang="scss">
@import '../sass/settings';

// Import Bulma and Buefy styles
@import '~bulma';
@import '~buefy/src/scss/buefy';
@import '../sass/app';
</style>
