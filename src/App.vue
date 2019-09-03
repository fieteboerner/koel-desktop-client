<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class App extends Vue {}
</script>
<style lang="scss">
@import './styles/settings';

// Import Bulma and Buefy styles
@import '~bulma';
@import '~buefy/src/scss/buefy';
@import './styles/app';

#app {
  user-select: none;
}
</style>
