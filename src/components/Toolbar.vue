<template>
  <div>
    <!-- Toolbar -->
    <div class="flex justify-between gap-2 flex-wrap-reverse">
      <!-- String Search -->
      <div class="w-full sm:w-auto sm:min-w-60">
        <el-input
          v-if="stringFilter"
          :placeholder="stringFilterPlaceholder"
          :prefix-icon="Search"
          v-model="filterForm.stringFilter"
          @input="debouncedSearch"
          clearable
        />
      </div>

      <!-- Filter, Reset n Refresh -->
      <div class="flex gap-2 justify-end flex-auto">
        <el-button
          v-if="hasFavourite"
          :icon="Star"
          circle
          @click="toggleFavoriteFilter"
          :type="props.store.filters.isFavoriteOnly ? 'primary' : 'default'"
        />
        <el-button
          :icon="Filter"
          circle
          @click="filterVisible = true"
          :type="hasAdvancedFilters ? 'primary' : 'default'"
        />
        <el-button :icon="Refresh" circle @click="handleResetAndRefresh" />

        <el-switch v-model="isGrid" class="toolbar-switch">
          <template #active-action>
            <i class="bx bx-grid-alt" />
          </template>
          <template #inactive-action>
            <i class="bx bx-list-ul" />
          </template>
        </el-switch>
      </div>
    </div>

    <!-- Filter Tag -->
    <div class="flex gap-2 flex-wrap h-[30px] mt-3">
      <el-tag
        v-for="tag in filterTags"
        :key="tag.key"
        closable
        type="primary"
        round
        @close="removeTag(tag.field, tag.value)"
      >
        {{ tag.label }}
      </el-tag>
    </div>

    <!-- Filter Dialog -->
    <ToolbarAdvancedFilter
      :columns="columns"
      :store="props.store"
      v-model:visible="filterVisible"
      @apply="applyFilters"
      @clear="clearFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted, computed } from 'vue'
import { debounce, cloneDeep } from 'lodash'
import { Search, Filter, Refresh, Star } from '@element-plus/icons-vue'
import ToolbarAdvancedFilter from './ToolbarAdvancedFilter.vue'

import { useViewModeStore } from '@/stores/viewMode'
import { useFilterTags } from '@/composables/toolbar/useFilterTags'
import type { ColumnConfig } from '@/types/columns'
import type { ToolbarStore } from '@/types/toolbar'

const props = withDefaults(
  defineProps<{
    columns: ColumnConfig[]
    store: ToolbarStore
    stringFilter?: boolean
    stringFilterPlaceholder?: string
    hasFavourite?: boolean
  }>(),
  {
    stringFilter: false,
    stringFilterPlaceholder: 'Search',
    hasFavourite: false
  }
)

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'resetAndRefresh'): void
}>()

// store and state
const viewModeStore = useViewModeStore()
const filterVisible = ref(false)
const filterForm = reactive(cloneDeep(props.store.filters))

// computed
const isGrid = computed({
  get: () => viewModeStore.mode === 'grid',
  set: (val: boolean) => {
    viewModeStore.setMode(val ? 'grid' : 'table')
  }
})

const filterTags = useFilterTags(props.columns, props.store)

const hasAdvancedFilters = computed(() =>
  Object.entries(props.store.filters).some(([key, val]) => {
    if (['stringFilter', 'isFavoriteOnly'].includes(key)) return false
    if (Array.isArray(val)) return val.length > 0
    return val !== null && val !== ''
  })
)

// functions
const debouncedSearch = debounce(() => {
  props.store.setFilters({
    ...props.store.filters,
    stringFilter: filterForm.stringFilter
  })
  emit('refresh')
}, 500)

const handleResetAndRefresh = () => {
  props.store.resetAll()
  Object.assign(filterForm, cloneDeep(props.store.filters))
  emit('resetAndRefresh')
}

const clearFilters = () => {
  props.store.clearAdvancedFilters()
  filterVisible.value = false
  emit('refresh')
}

const applyFilters = (updatedFilters: Record<string, any>) => {
  props.store.setFilters(updatedFilters)
  filterVisible.value = false
  emit('refresh')
}

const removeTag = (field: string, value?: string) => {
  props.store.clearFilter(field as keyof typeof props.store.filters, value)
  emit('refresh')
}

const toggleFavoriteFilter = () => {
  props.store.setFilters({
    ...props.store.filters,
    isFavoriteOnly: !props.store.filters.isFavoriteOnly
  })
  emit('refresh')
}

// lifecycle hooks
onUnmounted(() => {
  debouncedSearch.cancel()
})
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 0;
}
</style>
