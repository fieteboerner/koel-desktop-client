<template>
  <div>
    <div v-if="!items.length">
      <slot name="empty">There are no items to show</slot>
    </div>
    <div v-else class="item-list">
      <div
        class="item-list-item"
        :class="itemClasses(item)"
        v-for="item in items"
        :key="itemKey(item)"
        @click="$emit('select', $event, item)"
        @dblclick="$emit('open', $event, item)"
      >
        <slot v-bind="item" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { indexOf, last, sortBy, without } from "lodash";
import Vue, { CreateElement, VNode } from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class ItemList extends Vue {
  @Prop(Array) items: Array<any>;
  @Prop(Array) selected: Array<any>;
  @Prop(String) itemClass: string;
  @Prop({ type: Function, default: item => item.id }) itemKey: Function;

  itemClasses(item: any) {
    const classes: Object = {
      'is-selected': this.isSelected(item),
    }

    if(this.itemClass) {
      classes[this.itemClass] = true
    }

    return classes
  }

  isSelected(item: any): Boolean {
    return this.selected.includes(item);
  }
}
</script>

<style lang="scss">
@import "../../styles/settings";

.item-list {
  width: 100%;
  cursor: default;
  user-select: none;

  .item-list-item {
    display: flex;
    align-items: center;
    overflow: hidden;
    line-height: 1.75em;
    cursor: default;

    &.is-selected {
      background-color: $cyan;
      > * {
        color: $white;
      }
    }
  }
}
</style>