export interface ToolbarStore {
  filters: Record<string, any>
  filterOrder: string[]
  setFilters: (filters: Record<string, any>) => void
  clearFilter: (key: string, value?: string) => void
  clearAdvancedFilters: () => void
  clearAllFilters: () => void
  resetAll: () => void
  currentPage: number
}
