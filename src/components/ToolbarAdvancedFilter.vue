<template>
  <el-dialog
    v-model="localVisible"
    @open="initializeFilterForm"
    title="Advanced Filter"
    width="400px"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    class="max-w-screen min-w-[280px]"
  >
    <el-form :model="filterForm" label-position="top">
      <el-form-item v-for="col in advancedColumns" :key="col.name" :label="col.label">
        <!-- define each type field here -->
        <template v-if="col.type === 'multiselect'">
          <el-select v-model="filterForm[col.name]" placeholder="Select" multiple>
            <el-option
              v-for="opt in col.option"
              :key="typeof opt === 'string' ? opt : opt?.value"
              :label="typeof opt === 'string' ? opt : (opt?.label ?? opt?.value)"
              :value="typeof opt === 'string' ? opt : opt?.value"
            />
          </el-select>
        </template>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClear" round>Clear</el-button>
      <el-button type="primary" @click="handleApply" round>Apply</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch, reactive } from 'vue'
import type { ColumnConfig } from '@/types/columns'
import type { ToolbarStore } from '@/types/toolbar'
import { cloneDeep } from 'lodash'

const props = defineProps<{
  columns: ColumnConfig[]
  store: ToolbarStore
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'clear'): void
  (e: 'apply', updatedFilters: Record<string, any>): void
  (e: 'update:visible', value: boolean): void
}>()

const localVisible = ref(props.visible)

const filterForm = reactive<Record<string, any>>({})

const advancedColumns = computed(() => props.columns.filter((col) => col.advancedSearch))

watch(
  () => props.visible,
  (newVal) => {
    localVisible.value = newVal
  }
)

watch(localVisible, (newVal) => {
  emit('update:visible', newVal)
})

// Initialize form with a deep clone of store filters
const initializeFilterForm = () => {
  const cloned = cloneDeep(props.store.filters)

  for (const col of advancedColumns.value) {
    if (col.type === 'multiselect') {
      filterForm[col.name] = Array.isArray(cloned[col.name]) ? cloned[col.name] : []
    } else {
      filterForm[col.name] = cloned[col.name] ?? ''
    }
  }
}

const handleClear = () => {
  emit('clear')
}

const handleApply = () => {
  emit('apply', cloneDeep(filterForm))
}
</script>
