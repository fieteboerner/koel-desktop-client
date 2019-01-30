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
        :key="item.id"
        @click="$emit('select', $event, item)"
        @dblclick="$emit('open', $event, item)"
      >
        <ItemListCell v-for="column in columns" :column="column" :item="item" :key="column.id"/>
      </div>
    </div>
    <!-- mount helper components to get the component instances -->
    <div style="display: none;">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { indexOf, last, sortBy, without } from "lodash";
import Vue, { CreateElement, VNode } from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import ItemListColumn from "@/components/shared/ItemListColumn.vue";
import ItemListCell from "@/components/shared/ItemListCell.ts";

@Component({
  components: {
    ItemListCell
  }
})
export default class ItemList extends Vue {
  @Prop(Array) items: Array<any>;
  @Prop(Array) selected: Array<any>;
  @Prop(String) itemClass: string;

  columns: ItemListColumn[] = [];

  mounted() {
    this.columns = this.$slots.default
      .filter((column: VNode) => column.componentInstance)
      .map(column => <ItemListColumn>column.componentInstance);
  }

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

    .item-list-cell {
      color: #010101;
    }

    &.is-selected {
      background-color: $cyan;
      .item-list-cell {
        color: $white;
      }
    }
  }
}
</style>