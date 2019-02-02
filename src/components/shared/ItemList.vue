<template>
  <div style="height: 100%">
    <div v-if="!items.length">
      <slot name="empty">There are no items to show</slot>
    </div>
    <template v-else>
      <RecycleScroller
        v-if="virtualScroll"
        class="scroller item-list"
        :items="items"
        :item-height="itemHeight"
        :key-field="keyField"
      >
        <div
          slot-scope="{ item }"
          :class="itemClasses(item)"
          class="item-list-item"
          @click="onSelectItem($event, item)"
          @click.right="$emit('context', $event, item)"
          @dblclick="$emit('open', $event, item)"
        >
          <slot v-bind="item"></slot>
        </div>
      </RecycleScroller>
      <div v-else class="item-list">
        <div
          class="item-list-item"
          :class="itemClasses(item)"
          v-for="item in items"
          :key="item[keyField]"
          @click="onSelectItem($event, item)"
          @click.right="$emit('context', $event, item)"
          @dblclick="$emit('open', $event, item)"
        >
          <slot v-bind="item"/>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { indexOf, last, sortBy, without } from "lodash";
import Vue, { CreateElement, VNode } from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import SelectionContext from '@/services/selection-context';

@Component({
  components: { RecycleScroller }
})
export default class ItemList extends Vue {
  @Prop(Array) items: Array<any>;
  @Prop({ type: SelectionContext, default: () => {
    const context = new SelectionContext(true)
    context.dynamic = true
    return context
  }}) selectionContext: SelectionContext<any>
  @Prop(String) itemClass: string;
  @Prop(Boolean) virtualScroll: Boolean;
  @Prop({ type: String, default: "id" }) keyField: string;
  @Prop(Number) itemHeight: Number;

  created() {
    if (this.selectionContext.dynamic) {
      this.$set(this.selectionContext, 'items', this.items)
    }
  }

  itemClasses(item: any) {
    const classes: Object = {
      "is-selected": this.isSelected(item)
    };

    if (this.itemClass) {
      classes[this.itemClass] = true
    }

    return classes;
  }

  isSelected(item) {
    return this.selectionContext.isSelected(item);
  }

  onSelectItem(event: MouseEvent, item) {
    this.selectionContext.selectItem(event, item)
    this.$emit('select', event, item)
  }
}
</script>

<style lang="scss">
@import "../../styles/settings";

.scroller {
  height: 100%;
}

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
        color: $white !important;
      }
    }
  }
}
</style>