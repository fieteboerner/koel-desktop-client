import { includes, indexOf, last, sortBy, without } from 'lodash'

export default {
  data () {
    return {
      selected: []
    }
  },
  methods: {
    selectItem (event, item) {
      if (event.ctrlKey) {
        if (includes(this.selected, item)) {
          this.selected = without(this.selected, item)
        } else {
          this.selected.push(item)
        }
      } else if (this.selected.length && event.shiftKey) {
        let indexes = sortBy([
          indexOf(this.items, last(this.selected)),
          indexOf(this.items, item)
        ])

        for (let i = indexes[0]; i <= indexes[1]; i++) {
          this.selected.push(this.items[i])
        }
      } else {
        this.selected = [item]
      }
    }
  }
}
