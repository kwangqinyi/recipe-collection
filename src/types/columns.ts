interface BaseColumn {
  name: string
  label: string
  advancedSearch: boolean
}

interface StringColumn extends BaseColumn {
  type: 'string'
  searchInMain?: boolean
}

interface MultiselectColumn extends BaseColumn {
  type: 'multiselect'
  option: any
}

export type ColumnConfig = StringColumn | MultiselectColumn
