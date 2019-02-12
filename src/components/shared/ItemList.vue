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
          draggable="true"
          @click="onSelectItem($event, item)"
          @click.right="$emit('context', $event, item)"
          @dblclick="$emit('open', $event, item)"
          @dragstart="onDragStart($event, item)"
          @dragenter.prevent="onDragEnter"
          @dragover.prevent
          @dragleave="onDragLeave"
          @drop.prevent="onDrop"
        >
          <slot v-bind="item"></slot>
        </div>
      </RecycleScroller>
      <div v-else class="item-list">
        <div
          v-for="item in items"
          :class="itemClasses(item)"
          :key="item[keyField]"
          class="item-list-item"
          draggable="true"
          @click="onSelectItem($event, item)"
          @click.right="$emit('context', $event, item)"
          @dblclick="$emit('open', $event, item)"
          @dragstart="onDragStart($event, item)"
          @dragenter.prevent="onDragEnter"
          @dragover.prevent
          @dragleave="onDragLeave"
          @drop.prevent="onDrop"
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
import SelectionContext from '@/classes/selection-context';

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
  @Prop(String) itemClass: string
  @Prop(Boolean) virtualScroll: Boolean
  @Prop({ type: String, default: "id" }) keyField: string
  @Prop(Number) itemHeight: Number
  @Prop(Boolean) allowSongReordering: Boolean

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

  onDragStart(event: DragEvent, item) {
    if (!this.selectionContext.isSelected(item)) {
      this.selectionContext.selected = item
    }
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.dropEffect = 'move'

    const songIds = this.selectionContext.selected.map(item => item[this.keyField])
    event.dataTransfer.setData('application/x-koel.text+plain', JSON.stringify(songIds))
    // set Image (ghost)
  }

  onDrop(event: DragEvent) {
    if (!this.allowSongReordering) {
      return
    }

    this.onDragLeave(event)

  }

  onDragEnter(event: DragEvent) {
    if (!this.allowSongReordering) {
      return
    }

    const item: HTMLElement = event.target.parentNode
    item.classList.add('drag-over')
  }

  onDragLeave(event: DragEvent) {
    const item: HTMLElement = event.target.parentNode
    item.classList.remove('drag-over')
  }

  @Watch('items', { immediate: true })
  onItemsChange(items) {
    if(this.selectionContext.dynamic) {
      this.$set(this.selectionContext, 'items', items);
    }
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

    &.drag-over {
      border-bottom: 1px solid $primary;
    }

    &.is-selected {
      background-color: $cyan;
      > * {
        color: $white !important;
      }
    }
  }
}
</style>