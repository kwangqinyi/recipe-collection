import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { Recipe } from '@/types/recipe'
import { DefaultCuisineOptions, DefaultCategoryOptions } from '@/constants/options'
import { normalizeToArray } from '@/helper/common'

export const useRecipeStore = defineStore(
  'recipe',
  () => {
    // state
    const recipes = ref<Recipe[]>([])
    const isHydrated = ref(false)

    const filters = reactive<Record<string, any>>({
      stringFilter: '',
      cuisines: [],
      categories: [],
      isFavoriteOnly: false
    })

    const filterOrder = ref<string[]>([])
    const currentPage = ref(1)

    const cuisineOptions = ref<string[]>([])
    const categoryOptions = ref<string[]>([])

    // actions
    const getRecipes = async () => {
      if (isHydrated.value) return

      const res = await fetch(
        'https://raw.githubusercontent.com/micahcochran/json-cookbook/refs/heads/main/cookbook-100.json'
      )
      const raw = await res.json()

      const cuisineSet = new Set<string>(DefaultCuisineOptions)
      const categorySet = new Set<string>(DefaultCategoryOptions)

      const normalized = raw.map((r: any) => {
        const cuisines = normalizeToArray(r.recipeCuisine)
        const categories = normalizeToArray(r.recipeCategory)

        cuisines.forEach((c) => cuisineSet.add(c))
        categories.forEach((c) => categorySet.add(c))

        return {
          name: r.name,
          image: r.image?.[0] || '',
          author: r.author?.name || 'Unknown',
          description: r.description,
          cuisines,
          categories,
          ingredients: r.recipeIngredient || [],
          instructions: Array.isArray(r.recipeInstructions)
            ? r.recipeInstructions.map((step: any) => step.text)
            : typeof r.recipeInstructions?.text === 'string'
              ? [r.recipeInstructions.text]
              : [],
          isFavorite: false,
          isLocal: false
        }
      })

      cuisineOptions.value = Array.from(cuisineSet).sort()
      categoryOptions.value = Array.from(categorySet).sort()

      recipes.value = normalized
      isHydrated.value = true
    }

    const addCustomRecipe = (recipe: Recipe) => {
      recipes.value.unshift({ ...recipe, isLocal: true, isFavorite: false })
    }

    const updateRecipe = (name: string, data: Partial<Recipe>) => {
      const index = recipes.value.findIndex((r) => r.name === name)
      if (index !== -1) {
        recipes.value[index] = { ...recipes.value[index], ...data }
      }
    }

    const deleteRecipe = (name: string) => {
      recipes.value = recipes.value.filter((r) => r.name !== name)
    }

    const setFilters = (newFilters: Partial<typeof filters>) => {
      for (const key in newFilters) {
        const newVal = newFilters[key]

        filters[key] = newVal

        const isEmpty = Array.isArray(newVal) ? newVal.length === 0 : !newVal

        if (!isEmpty && !filterOrder.value.includes(key)) {
          filterOrder.value.push(key)
        }
        if (isEmpty) {
          filterOrder.value = filterOrder.value.filter((k) => k !== key)
        }
      }
    }

    // by key
    const clearFilter = (key: keyof typeof filters, valueToRemove?: string) => {
      const currentVal = filters[key]

      if (Array.isArray(currentVal)) {
        if (valueToRemove) {
          filters[key] = currentVal.filter((v) => v !== valueToRemove)
        } else {
          filters[key] = []
        }
      } else {
        filters[key] = ''
      }

      // Remove from filterOrder if now empty
      const isEmpty = Array.isArray(filters[key]) ? filters[key].length === 0 : !filters[key]

      if (isEmpty) {
        filterOrder.value = filterOrder.value.filter((k) => k !== key)
      }
    }

    // not include string search
    const clearAdvancedFilters = () => {
      Object.keys(filters).forEach((key) => {
        if (!['stringFilter', 'isFavoriteOnly'].includes(key)) {
          clearFilter(key as keyof typeof filters)
        }
      })
    }

    // including string search
    const clearAllFilters = () => {
      Object.keys(filters).forEach((key) => clearFilter(key as keyof typeof filters))
    }

    const resetAll = () => {
      clearAllFilters()
      currentPage.value = 1
    }

    return {
      recipes,
      isHydrated,
      getRecipes,
      addCustomRecipe,
      updateRecipe,
      deleteRecipe,
      cuisineOptions,
      categoryOptions,
      filters,
      filterOrder,
      currentPage,
      setFilters,
      clearFilter,
      clearAdvancedFilters,
      clearAllFilters,
      resetAll
    }
  },
  {
    persist: true
  }
)
