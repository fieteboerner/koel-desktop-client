<template>
  <div style="height: 100%" tabindex="-1">
    <div v-if="!items.length">
      <slot name="empty">
        There are no items to show
      </slot>
    </div>
    <template v-else>
      <RecycleScroller
        v-if="virtualScroll"
        ref="recycleScroller"
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
          @click.right="onContext($event, item)"
          @dblclick="fireOpen"
          @dragstart="onDragStart($event, item)"
          @dragenter.stop.prevent="onDragEnter($event, item)"
          @dragover.prevent
          @dragleave.stop.prevent="onDragLeave($event, item)"
          @drop.prevent="onDrop($event, item)"
        >
          <slot :item="item" />
        </div>
      </RecycleScroller>
      <div v-else class="item-list">
        <div
          v-for="item in items"
          ref="item"
          :key="item[keyField]"
          :class="itemClasses(item)"
          class="item-list-item"
          :draggable="allowItemReordering"
          @click="onSelectItem($event, item)"
          @click.right="onContext($event, item)"
          @dblclick="fireOpen"
          @dragstart="onDragStart($event, item)"
          @dragenter.prevent="onDragEnter($event, item)"
          @dragover.prevent
          @dragleave="onDragLeave($event, item)"
          @drop.prevent="onDrop($event, item)"
        >
          <slot :item="item" />
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
import { getScrollParent } from '@/helpers/scroll'
import { ListNavigationMap, ListNavigationActions, isActionPressed } from '@/helpers/keyboard'

@Component({
  components: { RecycleScroller }
})
export default class ItemList extends Vue {
  dragStore: DragStore<any> = new DragStore('drag-over')
  @Prop(Array) items: Array<any>;
  @Prop({
    type: SelectionContext,
    default: () => {
      const context = new SelectionContext(true)
      context.dynamic = true
      return context
    }
  }) selectionContext: SelectionContext<any>
  @Prop(String) itemClass: string
  @Prop(Boolean) virtualScroll: boolean
  @Prop({
    type: String,
    default: 'id'
  }) keyField: string
  @Prop(Number) itemHeight: number
  @Prop(Boolean) allowItemReordering: boolean

  mounted() {
    this.$el.addEventListener('keydown', (event: KeyboardEvent) => {
      this.selectionContext.handleKeyboardSelection(event)
      this.onHandleKeyPress(event)
    })
    this.scrollItemIntoView(this.selectionContext.lastSelected)
  }

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

  onHandleKeyPress(event: KeyboardEvent) {
    if (!this.selectionContext.hasSelection) {
      return
    }
    if (isActionPressed(ListNavigationMap, event, ListNavigationActions.OPEN)) {
      this.fireOpen()
      return
    }

    if (isActionPressed(ListNavigationMap, event, ListNavigationActions.DELETE)) {
      this.fireDelete()
      return
    }
  }

  fireOpen() {
    this.$emit('open')
  }

  fireDelete() {
    this.$emit('delete')
  }
  onSelectItem(event: MouseEvent, item) {
    this.selectionContext.handleMouseSelection(event, item)
  }

  onContext(event: MouseEvent, item) {
    if (!this.selectionContext.hasSelection || !this.selectionContext.isSelected(item)) {
      this.onSelectItem(event, item)
    }
    this.$emit('context', event)
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

  scrollItemIntoView(item) {
    const index = this.items.indexOf(item)
    if (index === -1) {
      return
    }

    if (this.virtualScroll) {
      const scrollTop = index * this.itemHeight

      this.executeScrollToPosition(
        this.$refs.recycleScroller.$el,
        this.itemHeight,
        scrollTop
      )
    } else {
      const itemToShow: HTMLElement = this.$refs.item[index]
      const scrollTop = itemToShow.offsetTop
      const itemHeight = itemToShow.getBoundingClientRect().height

      this.executeScrollToPosition(
        getScrollParent(itemToShow),
        itemHeight,
        scrollTop
      )
    }
  }

  executeScrollToPosition(scrollContainer: HTMLElement|null, itemHeight: number, position: number) {
    if (!scrollContainer) {
      return
    }

    const scrollContainerHeight = scrollContainer.getBoundingClientRect().height
    const top = scrollContainer.scrollTop
    const bottom = top + scrollContainerHeight

    if (position < top) {
      scrollContainer.scrollTo({ top: position })
    }

    if (position + itemHeight > bottom) {
      scrollContainer.scrollTo({ top: position - scrollContainerHeight + itemHeight })
    }
  }

  @Watch('selectionContext.lastSelected')
  onSelectionChange(lastSelected, oldLastSelected) {
    if (lastSelected !== oldLastSelected) {
      this.scrollItemIntoView(lastSelected)
      this.$emit('select', this.selectionContext)
    }
  }

  @Watch('items', { immediate: true })
  onItemsChange(items) {
    if(this.selectionContext.dynamic) {
      this.selectionContext.items = items
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
