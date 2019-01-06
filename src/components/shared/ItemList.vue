<template>
  <div>
    <div v-if="!items.length">
      <slot name="empty">There are no items to show</slot>
    </div>
    <table v-else class="item-list">
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <ItemListCell v-for="column in columns" :column="column" :item="item" :key="column.id" />
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
import Vue, { CreateElement, VNode } from "vue";
import { Component, Prop } from "vue-property-decorator";
import ItemListColumn from "@/components/shared/ItemListColumn.vue";
import ItemListCell from "@/components/shared/ItemListCell.ts";

@Component({
  components: {
    ItemListCell
  }
})
export default class ItemList extends Vue {
  @Prop(Array) items;

  columns: ItemListColumn[] = [];

  mounted() {
    this.columns = this.$slots.default
      .filter((column: VNode) => column.componentInstance)
      .map(column => <ItemListColumn>column.componentInstance);
  }

  getCellValue(column: ItemListColumn, item: any) {
    return item[column.show];
  }
}
</script>

<style lang="scss">
.item-list {
  width: 100%
}
</style>