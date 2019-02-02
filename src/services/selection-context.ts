import { without, sortBy, indexOf, last } from 'lodash'

export default class SelectionContext<T> {
    dynamic: Boolean = false
    multiselect: Boolean = false
    items: T[] = []
    selected: T[] = []

    constructor(multiselect: Boolean = true) {
        this.multiselect = multiselect
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
            // select from to with shift
        } else if (this.selected.length && event.shiftKey) {
            let indexes = sortBy([
                indexOf(this.items, last(this.selected)),
                indexOf(this.items, item)
            ])

            for (let i = indexes[0]; i <= indexes[1]; i++) {
                if (this.selected.includes(this.items[i])) continue
                this.selected = [...this.selected, this.items[i]]
            }
            // set item if no button is hold
        } else {
            this.selected = [item]
        }
    }
}
