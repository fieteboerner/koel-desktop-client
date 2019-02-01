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
          @click="$emit('select', $event, item)"
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
          @click="$emit('select', $event, item)"
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

@Component({
  components: { RecycleScroller }
})
export default class ItemList extends Vue {
  @Prop(Array) items: Array<any>;
  @Prop(Array) selected: Array<any>;
  @Prop(String) itemClass: string;
  @Prop(Boolean) virtualScroll: Boolean;
  @Prop({ type: String, default: "id" }) keyField: string;
  @Prop(Number) itemHeight: Number;

  itemClasses(item: any) {
    const classes: Object = {
      "is-selected": this.isSelected(item)
    };

    if (this.itemClass) {
      classes[this.itemClass] = true;
    }

    return classes;
  }

  isSelected(item: any): Boolean {
    return this.selected.includes(item);
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