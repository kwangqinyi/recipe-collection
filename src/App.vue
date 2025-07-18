<template>
  <div class="w-full max-w-screen-xl mx-auto py-6 px-4">
    <Header />
    <div>
      <div class="flex justify-between gap-2 mb-3 flex-wrap">
        <div>Recipe</div>
        <el-button :icon="Plus" round type="primary" @click="handleAddRecipe">
          Add Recipe
        </el-button>
      </div>
      <Toolbar
        :columns="recipeColumns"
        :store="recipeStore"
        :stringFilter="true"
        :hasFavourite="true"
        stringFilterPlaceholder="Search by Name / Author"
        @refresh="handlePageChange(1)"
        @resetAndRefresh="handleResetAndRefresh"
      />
      <component
        :is="viewModeStore.mode === 'grid' ? GridView : TableView"
        class="mt-4"
        v-bind="dynamicProps"
        :list="tableData"
        :isLoading="isLoading"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
        @favorite="handleFavorite"
      />
      <el-pagination
        class="mt-4 flex justify-end"
        background
        layout="total, prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalItems"
        @current-change="handlePageChange"
      />
    </div>

    <RecipeDetailModal ref="RecipeDetailModalRef" />
    <RecipeFormModal ref="RecipeFormModalRef" @refresh="handlePageChange(1)" />
    <CommonModal ref="deleteModalRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import Header from '@/components/layouts/Header.vue'
import Toolbar from '@/components/Toolbar.vue'
import TableView from '@/components/recipes/TableView.vue'
import GridView from '@/components/recipes/GridView.vue'
import RecipeDetailModal from '@/components/recipes/RecipeDetailModal.vue'
import RecipeFormModal from '@/components/recipes/RecipeFormModal.vue'
import CommonModal from '@/components/CommonModal.vue'

import { useViewModeStore } from '@/stores/viewMode'
import { useRecipeStore } from './stores/recipe'
import { useRecipeColumns } from '@/composables/recipe/useRecipeColumns'
import { filterData, paginateData } from '@/helper/dataProcessing'
import type { Recipe } from '@/types/recipe'

// stores
const viewModeStore = useViewModeStore()
const recipeStore = useRecipeStore()

// hooks
const recipeColumns = useRecipeColumns()

// state
const pageSize = 12
const tableRef = ref<InstanceType<typeof TableView> | null>(null)
const RecipeDetailModalRef = ref<InstanceType<typeof RecipeDetailModal> | null>(null)
const RecipeFormModalRef = ref<InstanceType<typeof RecipeFormModal> | null>(null)
const deleteModalRef = ref<InstanceType<typeof CommonModal> | null>(null)
const isLoading = ref(false)

// computed
const currentPage = computed({
  get: () => recipeStore.currentPage,
  set: (val: number) => (recipeStore.currentPage = val)
})

const filteredData = computed(() =>
  filterData(recipeStore.recipes, recipeStore.filters, recipeColumns.value)
)

const tableData = computed(() => {
  const { data } = paginateData(filteredData.value, currentPage.value, pageSize)
  return data
})

const totalItems = computed(() => filteredData.value.length)

const dynamicProps = computed(() => {
  return viewModeStore.mode === 'grid' ? {} : { ref: tableRef }
})

// functions
const handleView = (recipe: Recipe) => {
  RecipeDetailModalRef.value?.open(recipe)
}

const handleAddRecipe = () => {
  RecipeFormModalRef.value?.open()
}

const handleEdit = (recipe: Recipe) => {
  RecipeFormModalRef.value?.open('edit', recipe)
}

const handleDelete = (recipe: Recipe) => {
  deleteModalRef.value?.open({
    title: 'Delete Recipe',
    message: `Are you sure you want to delete ${recipe.name}?`,
    onConfirm: async () => {
      recipeStore.deleteRecipe(recipe.name)
      ElMessage.success('Recipe deleted')
    }
  })
}

const handleFavorite = (recipe: Recipe) => {
  recipeStore.updateRecipe(recipe.name, { isFavorite: !recipe.isFavorite })
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleResetAndRefresh = () => {
  handlePageChange(1)
}

// lifecycle hooks
onMounted(async () => {
  if (!recipeStore.isHydrated) {
    isLoading.value = true
    await recipeStore.getRecipes()
    isLoading.value = false
  }
})
</script>
