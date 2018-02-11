<template>
  <div class="sidebar-wrapper">
      <div class="sidebar" :style="{width}">
        <slot name="sidebar"></slot>
      </div>
      <single-layout>
          <slot></slot>
      </single-layout>
  </div>
</template>
<script>
export default {
  props: {
    width: {
      type: String,
      default () { return '350px' }
    }
  }
}
</script>
<style>
.sidebar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-content: stretch;
}

.sidebar-wrapper .sidebar {
    overflow-y: auto;
}
</style>


