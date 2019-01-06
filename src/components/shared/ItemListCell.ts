import Vue, { CreateElement, VNode, RenderContext } from 'vue'
import ItemListColumn from '@/components/shared/ItemListColumn.vue'

function getCellValue(column: ItemListColumn, item: Object) {
  const columnName = column.$props.show

  if (!item.hasOwnProperty(columnName)) {
      return null
  }

  return item[columnName]
}

export default Vue.extend({
    functional: true,

    render(h: CreateElement, { props }: RenderContext): VNode {
        const options = {}

        const { column, item } = props

        if (column.$scopedSlots.default) {
            return h('td', options, column.$scopedSlots.default({ column, item, value: getCellValue(column, item) }))
        }

        return h('td', options, getCellValue(column, item))
    }
})
