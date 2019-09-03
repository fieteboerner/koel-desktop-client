import { indexOf, last, sortBy, without } from 'lodash'

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
      // reset selected only if the item list was filled before
      // otherwise the selected data could be there before the list was initialized
      if(this._items.length) {
        this.selected = []
      }

      this._items = items
    }

    get sortedSelected(): T[] {
      return this.items.filter(item => this.isSelected(item))
    }

    isSelected(item: T): Boolean {
      return this.selected.includes(item)
    }

    selectItem(event: MouseEvent, item: T): void {
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
}
