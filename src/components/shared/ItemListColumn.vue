<template>
  <div v-if="false">
    <slot :item="{}"></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

let globalId = 1

@Component
export default class ItemListColumn extends Vue {
  @Prop(String) show;

  id = globalId++
}
</script>

