import { computed } from 'vue'
import type { ColumnConfig } from '@/types/columns'
import type { ToolbarStore } from '@/types/toolbar'

export const useFilterTags = (columns: ColumnConfig[], store: ToolbarStore) => {
  return computed(() => {
    return store.filterOrder.flatMap((key) => {
      const col = columns.find((c) => c.name === key)
      if (!col) return []

      const val = store.filters[key]
      if (col.type === 'multiselect' && Array.isArray(val)) {
        return val
          .filter((v) => v) // filter out empty values
          .map((item) => ({
            key: `${key}:${item}`,
            field: key,
            label: item,
            value: item
          }))
      }

      if (val) {
        return [
          {
            key,
            field: key,
            label: col.label,
            value: val
          }
        ]
      }

      return []
    })
  })
}
