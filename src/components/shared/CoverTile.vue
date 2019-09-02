<template>
  <div class="card">
    <div class="card-image" @click="$emit('cover')">
      <figure class="image is-square">
        <img :src="img" :alt="title">
      </figure>
    </div>
    <div class="card-content" v-if="title || subtitle">
      <div class="title is-5 truncate" @click="$emit('title')">{{ title }}</div>
      <div v-if="subtitle" class="subtitle is-6 truncate" @click="$emit('subtitle')">{{ subtitle }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class CoverTile extends Vue {
  @Prop(String) img
  @Prop(String) title
  @Prop(String) subtitle
}
</script>
<style scoped>
.is-selected {
    box-shadow: 0 3px 5px;
}

.title:hover, .subtitle:hover {
  cursor: pointer;
  text-decoration: underline;
}

.card-image {
  cursor: pointer;
}
</style>
