<template>
  <div id="app">
    {{ test }}
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class App extends Vue {}
</script>
<style lang="scss">
@import '../sass/settings';

// Import Bulma and Buefy styles
@import '~bulma';
@import '~buefy/src/scss/buefy';
@import '../sass/app';

#app {
  user-select: none;
}
</style>
