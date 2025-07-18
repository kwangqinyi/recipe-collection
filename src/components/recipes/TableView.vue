<template>
  <div class="bg-white rounded-2xl border border-[#E5EAF3] p-3">
    <el-table
      ref="tableRef"
      :data="list"
      v-loading="isLoading"
      @row-click="handleRowClick"
      :row-class-name="'clickable-row'"
    >
      <el-table-column prop="name" label="Name" min-width="230px">
        <template #default="{ row }">
          <div class="flex gap-2 items-center">
            <div
              class="w-14 h-14 shrink-0 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="isImageValid(row.image)"
                :src="row.image"
                alt="Avatar"
                class="object-cover w-full h-full"
              />
              <span v-else class="text-[#409EFF] text-lg font-bold">
                {{ row.name[0]?.toUpperCase() }}
              </span>
            </div>
            <div>{{ row.name }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="author" label="Author" width="180" />

      <el-table-column prop="cuisines" label="Cuisine" min-width="160">
        <template #default="{ row }">
          <div class="flex flex-wrap gap-1">
            <el-tag
              v-for="(tag, index) in row.cuisines"
              :key="index"
              size="small"
              type="success"
              disable-transitions
            >
              {{ tag }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="categories" label="Category" min-width="200">
        <template #default="{ row }">
          <div class="flex flex-wrap gap-1">
            <el-tag
              v-for="(tag, index) in row.categories"
              :key="index"
              size="small"
              type="info"
              disable-transitions
            >
              {{ tag }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Action" width="150">
        <template #default="{ row }">
          <div>
            <el-button
              :icon="row.isFavorite ? StarFilled : Star"
              :style="row.isFavorite ? 'color: #ffd250; font-size: 20px' : ''"
              circle
              @click.stop="$emit('favorite', row)"
            />
            <el-button :icon="EditPen" circle @click.stop="$emit('edit', row)" />
            <el-button :icon="Delete" circle @click.stop="$emit('delete', row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ElTable } from 'element-plus'
import { EditPen, Delete, Star, StarFilled } from '@element-plus/icons-vue'

import { isImageValid } from '@/helper/image'
import type { Recipe } from '@/types/recipe'

defineProps<{
  list: Recipe[]
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'view', recipe: Recipe): void
  (e: 'edit', recipe: Recipe): void
  (e: 'delete', recipe: Recipe): void
  (e: 'favorite', recipe: Recipe): void
}>()

const tableRef = ref<InstanceType<typeof ElTable> | null>(null)

const handleRowClick = (row: Recipe) => {
  emit('view', row)
}
</script>
