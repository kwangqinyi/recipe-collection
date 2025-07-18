<template>
  <el-skeleton :loading="isLoading" animated>
    <div v-if="list.length" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
      <div
        v-for="item in list"
        :key="item.name"
        class="rounded-xl shadow-sm bg-white overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-80 cursor-pointer"
        @click="$emit('view', item)"
      >
        <!-- Image -->
        <div class="relative h-[85%]">
          <img
            v-if="isImageValid(item.image)"
            :src="item.image"
            alt="Recipe"
            class="w-full h-full object-cover"
          />
          <span
            v-else
            class="absolute inset-0 bg-blue-100 flex items-center justify-center text-[#409EFF] text-2xl font-bold"
          >
            {{ item.name[0]?.toUpperCase() }}
          </span>

          <!-- Favourite Icon -->
          <div class="absolute top-2 right-2 z-10">
            <el-button
              :icon="item.isFavorite ? StarFilled : Star"
              :style="item.isFavorite ? 'color: #ffd250; font-size: 18px' : ''"
              size="small"
              class="!bg-white/20 backdrop-blur-sm"
              circle
              @click.stop="$emit('favorite', item)"
            />
          </div>

          <!-- Bottom Overlay Actions -->
          <div class="absolute bottom-2 left-2 right-2 flex justify-between items-end z-10">
            <!-- Cuisine Tag -->
            <div class="flex flex-wrap-reverse gap-1">
              <el-tag
                v-for="(cuisine, i) in item.cuisines"
                :key="i"
                size="small"
                type="info"
                class="!bg-white/60 !text-gray-800 backdrop-blur-sm border border-white/30"
              >
                {{ cuisine }}
              </el-tag>
            </div>

            <!-- Edit/Delete Buttons -->
            <div class="flex">
              <el-button
                :icon="EditPen"
                size="small"
                circle
                class="!bg-white/60 backdrop-blur-sm"
                @click.stop="$emit('edit', item)"
              />
              <el-button
                :icon="Delete"
                size="small"
                circle
                class="!bg-white/60 backdrop-blur-sm"
                @click.stop="$emit('delete', item)"
              />
            </div>
          </div>
        </div>

        <!-- Recipe Name -->
        <div class="p-3 flex-1 flex items-center">
          <h3 class="text-base font-semibold text-[#1F2D3D] truncate" :title="item.name">
            {{ item.name }}
          </h3>
        </div>
      </div>
    </div>
    <el-empty v-else description="No Recipes Found" />
  </el-skeleton>
</template>

<script setup lang="ts">
import { isImageValid } from '@/helper/image'
import type { Recipe } from '@/types/recipe'
import { EditPen, Delete, Star, StarFilled } from '@element-plus/icons-vue'

defineProps<{
  list: Recipe[]
  isLoading: boolean
}>()

defineEmits<{
  (e: 'view', recipe: Recipe): void
  (e: 'edit', recipe: Recipe): void
  (e: 'delete', recipe: Recipe): void
  (e: 'favorite', recipe: Recipe): void
}>()
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 8px;
}
</style>
