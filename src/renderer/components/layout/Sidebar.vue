<template>
  <div class="sidebar-wrapper">
      <div class="sidebar" :style="{width}">
        <slot name="sidebar"></slot>
      </div>
      <div class="layout-content">
          <slot></slot>
      </div>
  </div>
</template>
<script>
export default {
  props: {
    width: {
      type: String,
      default () {
        return '350px'
      }
    }
  }
}
</script>
<style lang="scss">
.sidebar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-content: stretch;

  .sidebar {
    overflow-y: auto;
  }

  .layout-content {
    flex: 1;
    overflow-y: auto;
  }
}
</style>


