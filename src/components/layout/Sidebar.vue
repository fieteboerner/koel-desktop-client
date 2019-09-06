<template>
  <div class="sidebar-wrapper">
    <div class="sidebar" :style="{width}">
      <slot name="sidebar" />
    </div>
    <div class="layout-content">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class Sidebar extends Vue {
  @Prop({
    type: String,
    default: '350px'
  }) width
}
</script>
<style lang="scss">
.sidebar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-content: stretch;
  height: 100%;

  .sidebar {
    overflow-y: auto;
  }

  .layout-content {
    flex: 1;
    overflow-y: auto;
  }
}
</style>


