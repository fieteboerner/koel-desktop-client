import { indexOf, first, last, sortBy, without } from 'lodash'
import {
  ListNavigationActions,
  ListNavigationMap,
  isValidKey,
  isActionPressed
} from '@/helpers/keyboard'

export default class SelectionContext<T> {
    dynamic: Boolean = false
    multiselect: Boolean = false
    _items: T[] = []
    _selected: T[] = []

    constructor(multiselect: Boolean = true) {
      this.multiselect = multiselect
    }

    get hasSelection() {
      return Boolean(this.selected.length)
    }

    get selected(): T[] {
      return this._selected || []
    }

    set selected(items) {
      if(typeof items === 'undefined') {
        return
      }

      if (!Array.isArray(items)){
        this._selected = [items]
        return
      }

      this._selected = items
    }

    get items () {
      return this._items || []
    }

    set items (items: T[]) {
      // remove the selected items if they are no longer present in the items list
      if(this._items.length) {
        this.selected = this.selected.filter(selectedItem => items.includes(selectedItem))
      }

      this._items = items
    }

    get sortedSelected(): T[] {
      return this.items.filter(item => this.isSelected(item))
    }

    get firstSortedSelected(): T|null {
      return this.hasSelection ? first(this.sortedSelected) : null
    }

    get lastSortedSelected(): T|null {
      return this.hasSelection ? last(this.sortedSelected) : null
    }

    get firstSelected(): T|null {
      return this.hasSelection ? first(this.selected) : null
    }

    get lastSelected(): T|null {
      return this.hasSelection ? last(this.selected) : null
    }

    isSelected(item: T): Boolean {
      return this.selected.includes(item)
    }

    handleMouseSelection(event: MouseEvent, item: T): void {
      if (!this.multiselect) {
        this.selected = [item]
        return
      }

      // toggle single item with ctrl or cmd
      if (event.ctrlKey || event.metaKey) {
        if (this.isSelected(item)) {
          this.selected = without(this.selected, item)
        } else {
          this.selected = [...this.selected, item]
        }
        // select range when shift was hold
      } else if (this.selected.length && event.shiftKey) {
        let indexes = sortBy([
          indexOf(this.items, last(this.selected)),
          indexOf(this.items, item)
        ])

        for (let i = indexes[0]; i <= indexes[1]; i++) {
          if (this.selected.includes(this.items[i])) continue
          this.selected = [...this.selected, this.items[i]]
        }
        // set item if no button was hold
      } else {
        this.selected = [item]
      }
    }

    handleKeyboardSelection(event: KeyboardEvent): void {
      const isKeyUp = isActionPressed(ListNavigationMap, event, ListNavigationActions.UP)
      const isKeyDown = isActionPressed(ListNavigationMap, event, ListNavigationActions.DOWN)
      const isShiftPressed = event.shiftKey

      if (!isValidKey(ListNavigationMap, event) || !this.hasSelection) {
        return
      }

      const lastItemsIndex = this.items.length - 1

      // abort if the selection is already at the top/bottom
      if(isKeyDown && this.lastSelected === this.items[lastItemsIndex] ||
        isKeyUp && this.firstSelected === first(this.items)) {
        return
      }

      event.preventDefault()

      // item index (in full item list) of the last selected item
      const selectedItemIndex = this.items.findIndex(item => item === this.lastSelected)
      // item that comes before the last selected item in the item list
      const previousItem = this.items[Math.max(selectedItemIndex - 1, 0)]
      // item that comes after the last selected item in the item list
      const nextItem = this.items[Math.min(selectedItemIndex + 1, lastItemsIndex)]
      // item that was selected before the last selection
      const previousSelectedItem = this.selected[this.selected.length - 2]

      if (this.multiselect) {
        if (isKeyUp && isShiftPressed) {
          // if the selection will be undone
          if(previousSelectedItem && this.isSelected(previousSelectedItem) && previousSelectedItem === previousItem) {
            this.selected = without(this.selected, this.lastSelected)
          } else { // the selection will be expanded
            // it is possible that the previous item is already selected (move it to the end of array so it is the lastSelectedItem)
            this.selected = [...without(this.selected, previousItem), previousItem]
          }
          return
        }

        if (isKeyDown && isShiftPressed) {
          // if the selection will be undone
          if(previousSelectedItem && this.isSelected(previousSelectedItem) && previousSelectedItem === nextItem) {
            this.selected = without(this.selected, this.lastSelected)
          } else { // the selection will be expanded
            // it is possible that the next item is already selected (move it to the end of array so it is the lastSelectedItem)
            this.selected = [...without(this.selected, nextItem), nextItem]
          }
          return
        }
      }

      // select only previous item
      if (isKeyUp) {
        this.selected = [previousItem]
        return
      }

      // select only next item
      if (isKeyDown) {
        this.selected = [nextItem]
        return
      }
    }
}
