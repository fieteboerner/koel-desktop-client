import Vue, { CreateElement, VNode, RenderContext, ComponentOptions, VNodeData } from 'vue'
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
      const options: VNodeData = {
        staticClass: 'item-list-cell'
      }

      const { column, item } = props
      if(column.cellClass) {
        options.class = column.cellClass
      }

      if (column.$scopedSlots.default) {
          return h('div', options, column.$scopedSlots.default({ column, item, value: getCellValue(column, item) }))
      }

      return h('div', options, getCellValue(column, item))
    }
})
