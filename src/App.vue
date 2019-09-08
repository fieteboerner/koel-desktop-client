<template>
  <div id="app">
    <transition name="fade">
      <router-view />
    </transition>
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
@import '@/styles/app';
</style>
