import type { ColumnConfig } from '@/types/columns'

export const filterData = <T extends Record<string, any>>(
  data: T[],
  filters: Record<string, any>,
  columns: ColumnConfig[]
): T[] => {
  return data.filter((item) => {
    // favourite filter
    if (filters.isFavoriteOnly && !item.isFavorite) {
      return false
    }

    // string filter
    const stringFilter = filters.stringFilter?.toLowerCase?.() || ''

    const stringFilterMatch =
      !stringFilter ||
      columns
        .filter((col) => col.type === 'string' && col.searchInMain)
        .some((col) => {
          const fieldValue = item[col.name]?.toLowerCase?.()
          return fieldValue?.includes?.(stringFilter)
        })

    // advanced filter
    const advancedMatch = columns.every((col) => {
      const filterVal = filters[col.name]
      const itemVal = item[col.name]

      if (col.type === 'string' && col.searchInMain) return true

      if (col.type === 'multiselect') {
        if (!Array.isArray(filterVal) || filterVal.length === 0) return true
        return filterVal.some((v) => itemVal.includes(v))
      }

      return true
    })

    return stringFilterMatch && advancedMatch
  })
}

export const paginateData = <T>(
  data: T[],
  page: number,
  pageSize: number
): { data: T[]; total: number } => {
  const total = data.length
  const start = (page - 1) * pageSize
  const pagedData = data.slice(start, start + pageSize)
  return { data: pagedData, total }
}
