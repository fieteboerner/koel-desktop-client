<template>
  <div class="is-size-3 empty-list-message">{{ message }}</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class EmptyListMessage extends Vue {
  @Prop({ type: String, required: true }) message: string;
}
</script>

<style scoped lang="scss">
.empty-list-message {
  margin-top: 1.5em;
  opacity: 0.5;
  text-align: center;
}
</style>

