<template>
  <div class="single-wrapper">
    <slot />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Single extends Vue { }
</script>
<style lang="scss">
@import '../../styles/settings';

.single-wrapper {
  margin: $size-normal;
}
</style>

