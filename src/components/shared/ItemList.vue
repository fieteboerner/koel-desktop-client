<template>
  <div>
    <div v-if="!items.length">
      <slot name="empty">There are no items to show</slot>
    </div>
    <table v-else class="item-list">
      <tbody>
        <tr
          class="item-list-row"
          :class="{ 'is-selected': isSelected(item) }"
          v-for="item in items"
          :key="item.id"
          @click="$emit('select', $event, item)"
        >
          <ItemListCell v-for="column in columns" :column="column" :item="item" :key="column.id"/>
        </tr>
      </tbody>
    </table>
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

  columns: ItemListColumn[] = [];

  mounted() {
    this.columns = this.$slots.default
      .filter((column: VNode) => column.componentInstance)
      .map(column => <ItemListColumn>column.componentInstance);
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

  .item-list-row {
    border-bottom: 1px solid #cccccc;
    padding: 7px;
    line-height: 1.75em;
    overflow: hidden;

    td {
      padding: 7px;
      color: #010101;
      font-weight: 500;
    }

    &.is-selected {
      td {
        background-color: $cyan;
        color: $white;
      }
    }
  }
}
</style>