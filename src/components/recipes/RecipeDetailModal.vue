<template>
  <el-dialog
    v-model="visible"
    title=""
    width="600px"
    top="5vh"
    :close-on-click-modal="false"
    class="recipe-detail-dialog"
  >
    <!-- Image -->
    <div class="w-full max-h-[400px] rounded-xl overflow-hidden mb-4">
      <img
        v-if="isImageValid(recipe?.image)"
        :src="recipe?.image"
        alt="Recipe Image"
        class="w-full h-full"
      />
      <div
        v-else
        class="w-full min-h-50 bg-blue-100 flex items-center justify-center text-[#409EFF] text-4xl font-bold"
      >
        {{ recipe?.name[0]?.toUpperCase() }}
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-4 px-1">
      <div>
        <h2 class="text-2xl font-semibold text-[#1F2D3D]">{{ recipe?.name }}</h2>
        <p class="text-sm text-gray-500 mt-1">By {{ recipe?.author }}</p>
      </div>

      <p v-if="recipe?.description" class="text-gray-700 whitespace-pre-line">
        {{ isExpanded ? recipe.description : truncatedDescription }}
        <span v-if="isTruncatable" @click="toggleExpand" class="text-blue-500 cursor-pointer ml-1">
          {{ isExpanded ? 'Show less' : '... Show more' }}
        </span>
      </p>
      <div class="flex flex-wrap gap-2">
        <el-tag
          v-for="(cuisine, i) in recipe?.cuisines"
          :key="'cuisine' + i"
          type="success"
          size="small"
        >
          {{ cuisine }}
        </el-tag>
        <el-tag
          v-for="(category, i) in recipe?.categories"
          :key="'category' + i"
          type="info"
          size="small"
        >
          {{ category }}
        </el-tag>
      </div>

      <div v-if="recipe?.ingredients?.length">
        <h3 class="text-base font-semibold mt-2 mb-1">Ingredients</h3>
        <ul class="list-disc list-inside text-sm text-gray-700">
          <li v-for="(item, i) in recipe.ingredients" :key="i">{{ item }}</li>
        </ul>
      </div>

      <div v-if="recipe?.instructions?.length">
        <h3 class="text-base font-semibold mt-2 mb-1">Instructions</h3>
        <ul class="list-decimal list-inside text-sm text-gray-700">
          <li v-for="(step, i) in recipe.instructions" :key="i">{{ step }}</li>
        </ul>
      </div>
    </div>

    <template #footer>
      <el-button @click="visible = false" round>Close</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Recipe } from '@/types/recipe'
import { isImageValid } from '@/helper/image'

const visible = ref(false)
const recipe = ref<Recipe | null>(null)

// description usage
const maxLength = 200
const isExpanded = ref(false)

const isTruncatable = computed(() => {
  const descLength = recipe.value?.description.length || 0
  return descLength > maxLength
})

const truncatedDescription = computed(() => recipe.value?.description.slice(0, maxLength))

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

defineExpose({
  open: (data: Recipe) => {
    recipe.value = data
    visible.value = true
  }
})
</script>

<style scoped>
.recipe-detail-dialog :deep(.el-dialog__body) {
  padding-top: 0;
}

ul {
  padding-left: 1.25rem;
  list-style-position: outside;
}

ul li {
  margin-bottom: 4px;
  line-height: 1.5;
  word-break: break-word;
}
</style>
