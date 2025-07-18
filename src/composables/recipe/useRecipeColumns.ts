import { computed } from 'vue'
import { useRecipeStore } from '@/stores/recipe'
import type { ColumnConfig } from '@/types/columns'

export const useRecipeColumns = () => {
  const recipeStore = useRecipeStore()

  return computed<ColumnConfig[]>(() => [
    {
      name: 'name',
      label: 'Name',
      type: 'string',
      advancedSearch: false,
      searchInMain: true
    },
    {
      name: 'author',
      label: 'Author',
      type: 'string',
      advancedSearch: false,
      searchInMain: true
    },
    {
      name: 'cuisines',
      label: 'Cuisine',
      type: 'multiselect',
      advancedSearch: true,
      option: recipeStore.cuisineOptions
    },
    {
      name: 'categories',
      label: 'Category',
      type: 'multiselect',
      advancedSearch: true,
      option: recipeStore.categoryOptions
    }
  ])
}
