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
          @click="onSelect($event, item)"
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
  @Prop(Array) items;
  @Prop(Boolean) selectable;
  @Prop(Boolean) multiselectable;
  @Prop([Object, Array]) selected;

  columns: ItemListColumn[] = [];
  selectedItems: Array<any> = [];

  mounted() {
    this.columns = this.$slots.default
      .filter((column: VNode) => column.componentInstance)
      .map(column => <ItemListColumn>column.componentInstance);
  }

  get sortedSelected() {
    return this.items.filter(item => this.isSelected(item));
  }

  isSelected(item) {
    return this.selectedItems.includes(item);
  }

  onSelect(event: MouseEvent, item: any): void {
    if (!this.selectable && !this.multiselectable) return;

    // single select
    if (!this.multiselectable) {
      if (this.isSelected(item)) return;
      this.selectedItems = [item];
      this.$emit("selection-change", item);
    }

    // multi select
    // toggle single item with ctrl or cmd
    if (event.ctrlKey || event.metaKey) {
      if (this.isSelected(item)) {
        this.selectedItems = without(this.selectedItems, item);
      } else {
        this.selectedItems.push(item);
      }
      // select from to with shift
    } else if (this.selectedItems.length && event.shiftKey) {
      let indexes = sortBy([
        indexOf(this.items, last(this.selectedItems)),
        indexOf(this.items, item)
      ]);

      for (let i = indexes[0]; i <= indexes[1]; i++) {
        if (this.isSelected(this.items[i])) continue;
        this.selectedItems.push(this.items[i]);
      }
      // set item if no button is hold
    } else {
      this.selectedItems = [item];
    }

    this.$emit("selection-change", item, this.sortedSelected);
  }

  @Watch("selected", { immediate: true })
  onSelectedChange(selected) {
    this.selectedItems = Array.isArray(selected) ? selected : [selected];
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