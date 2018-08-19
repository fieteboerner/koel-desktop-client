import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { includes, indexOf, last, sortBy, without } from 'lodash'

@Component
export default class ListSelect extends Vue {
  selected = []

  get items () {
    return []
  }

  get sortedSelected() {
    const selected = []
    this.items.forEach(item => {
      if (this.isSelected(item)) selected.push(item)
    })

    return selected
  }
  isSelected(item) {
    return includes(this.selected, item)
  }
  selectItem(event, item) {
    // toggle single item with ctrl or cmd
    if (event.ctrlKey || event.metaKey) {
      if (this.isSelected(item)) {
        this.selected = without(this.selected, item)
      } else {
        this.selected.push(item)
      }
      // select from to with shift
    } else if (this.selected.length && event.shiftKey) {
      let indexes = sortBy([
        indexOf(this.items, last(this.selected)),
        indexOf(this.items, item)
      ])

      for (let i = indexes[0]; i <= indexes[1]; i++) {
        if (includes(this.selected, this.items[i])) continue
        this.selected.push(this.items[i])
      }
      // set item if no button is hold
    } else {
      this.selected = [item]
    }
  }
}
