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
          :draggable="allowItemReordering"
          @click="onSelectItem($event, item)"
          @click.right="$emit('context', $event, item)"
          @dblclick="$emit('open', $event, item)"
          @dragstart="onDragStart($event, item)"
          @dragenter.stop.prevent="onDragEnter($event, item)"
          @dragover.prevent
          @dragleave.stop.prevent="onDragLeave($event, item)"
          @drop.prevent="onDrop($event, item)"
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
          :draggable="allowItemReordering"
          @click="onSelectItem($event, item)"
          @click.right="$emit('context', $event, item)"
          @dblclick="$emit('open', $event, item)"
          @dragstart="onDragStart($event, item)"
          @dragenter.prevent="onDragEnter($event, item)"
          @dragover.prevent
          @dragleave="onDragLeave($event, item)"
          @drop.prevent="onDrop($event, item)"
        >
          <slot v-bind="item"/>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { indexOf, last, sortBy, without } from 'lodash'
import Vue, { CreateElement, VNode } from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { RecycleScroller } from 'vue-virtual-scroller'
import SelectionContext from '@/classes/selection-context'
import DragStore from '@/classes/drag-store'

@Component({
  components: { RecycleScroller }
})
export default class ItemList extends Vue {
  dragStore: DragStore<any> = new DragStore('drag-over')
  @Prop(Array) items: Array<any>;
  @Prop({ type: SelectionContext, default: () => {
    const context = new SelectionContext(true)
    context.dynamic = true
    return context
  } }) selectionContext: SelectionContext<any>
  @Prop(String) itemClass: string
  @Prop(Boolean) virtualScroll: Boolean
  @Prop({ type: String, default: 'id' }) keyField: string
  @Prop(Number) itemHeight: Number
  @Prop(Boolean) allowItemReordering: Boolean

  destroyed() {
    this.dragStore = null // GC
  }

  itemClasses(item: any) {
    const classes: Object = {
      'is-selected': this.isSelected(item)
    }

    if (this.itemClass) {
      classes[this.itemClass] = true
    }

    return classes
  }

  isSelected(item) {
    return this.selectionContext.isSelected(item)
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

  onDrop(event: DragEvent, item) {
    if (!this.allowItemReordering) {
      return
    }
    this.dragStore.handleDrop(event, item[this.keyField])
  }

  onDragEnter(event: DragEvent, item) {
    if (!this.allowItemReordering) {
      return
    }
    this.dragStore.handleEnter(event, item[this.keyField])
  }

  onDragLeave(event: DragEvent, item) {
    this.dragStore.handleLeave(event, item[this.keyField])
  }

  @Watch('items', { immediate: true })
  onItemsChange(items) {
    if(this.selectionContext.dynamic) {
      this.$set(this.selectionContext, 'items', items)
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/settings";

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
    cursor: default;

    &.drag-over {
      border-bottom: 1px solid $primary;
      box-shadow:0px 1px $primary;
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