<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600px"
    top="5vh"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" label-position="top">
      <el-form-item label="Recipe Image">
        <div class="upload-wrapper relative inline-block">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleFileChange"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>

            <template #tip>
              <div class="el-upload__tip">jpg/jpeg/png files with a size less than 100kb</div>
            </template>
          </el-upload>

          <el-button
            v-if="imageUrl"
            class="delete_btn absolute top-[-8px] right-[-8px] z-20 p-0 text-lg w-fit"
            type="danger"
            :icon="CircleClose"
            link
            @click.stop.prevent="handleRemove"
          />
        </div>
      </el-form-item>

      <el-form-item label="Name" prop="name">
        <el-input v-model="form.name" placeholder="Input Name" maxlength="60" show-word-limit />
      </el-form-item>

      <el-form-item label="Description" prop="description">
        <el-input v-model="form.description" placeholder="Input Description" type="textarea" />
      </el-form-item>

      <el-form-item label="Author" prop="author">
        <el-input
          v-model="form.author"
          placeholder="Input Author"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="Cuisine" prop="cuisines">
        <el-select
          v-model="form.cuisines"
          multiple
          placeholder="Select cuisines"
          filterable
          default-first-option
          style="width: 100%"
        >
          <el-option
            v-for="option in CuisineOptions"
            :key="option"
            :label="option"
            :value="option"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Category" prop="categories">
        <el-select
          v-model="form.categories"
          multiple
          placeholder="Select categories"
          filterable
          default-first-option
          style="width: 100%"
        >
          <el-option
            v-for="option in CategoryOptions"
            :key="option"
            :label="option"
            :value="option"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Ingredients" prop="ingredients">
        <div
          v-for="(_, index) in form.ingredients"
          :key="index"
          class="flex items-center gap-2 mb-2 w-full"
        >
          <el-input
            v-model="form.ingredients[index]"
            placeholder="Enter ingredient"
            class="flex-1"
          />
          <el-button
            :icon="Delete"
            @click="form.ingredients.splice(index, 1)"
            type="danger"
            circle
            size="small"
          />
        </div>

        <el-button type="primary" plain @click="form.ingredients.push('')" class="w-full">
          Add Ingredient
        </el-button>
      </el-form-item>

      <el-form-item label="Instructions" prop="instructions">
        <div
          v-for="(_, index) in form.instructions"
          :key="index"
          class="flex items-center gap-2 mb-2 w-full"
        >
          <el-input
            v-model="form.instructions[index]"
            placeholder="Enter instruction"
            class="flex-1"
          />
          <el-button
            :icon="Delete"
            @click="form.instructions.splice(index, 1)"
            type="danger"
            circle
            size="small"
          />
        </div>
        <el-button type="primary" plain @click="form.instructions.push('')" class="w-full">
          Add Instructions
        </el-button>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false" round>Cancel</el-button>
      <el-button type="primary" @click="submitForm" round :loading="isSubmitting">Submit</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, CircleClose } from '@element-plus/icons-vue'
import type { UploadProps, FormInstance, FormRules } from 'element-plus'

import type { Recipe, RecipeForm } from '@/types/recipe'
import { useRecipeStore } from '@/stores/recipe'
import { Delete } from '@element-plus/icons-vue'

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const recipeStore = useRecipeStore()

const visible = ref(false)
const formRef = ref<FormInstance>()
const mode = ref<'add' | 'edit'>('add')
const isSubmitting = ref(false)
const originalName = ref('') // to exclude from name duplicate checking

// image
const selectedFile = ref<File | null>(null)
const imageUrl = ref('')

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg']
const MAX_IMAGE_SIZE_KB = 100

const DEFAULT_FORM: RecipeForm = {
  name: '',
  author: '',
  image: '',
  ingredients: [''],
  instructions: [''],
  cuisines: [],
  categories: [],
  description: '',
  isFavorite: false,
  isLocal: true
}

const form = reactive<RecipeForm>({ ...DEFAULT_FORM })

const rules: FormRules = {
  name: [
    { required: true, message: 'Name is required', trigger: 'blur' },
    {
      validator: (_, value, callback) => {
        const exists = recipeStore.recipes.find(
          (r) => r.name === value && (mode.value !== 'edit' || r.name !== originalName.value)
        )
        if (exists) {
          callback(new Error('Recipe name must be unique'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  description: [{ required: true, message: 'Description is required', trigger: 'blur' }],
  author: [{ required: true, message: 'Author is required', trigger: 'blur' }],
  cuisines: [{ required: true, message: 'Cuisine is required', trigger: 'blur' }],
  categories: [{ required: true, message: 'Cuisine is required', trigger: 'blur' }],
  ingredients: [
    {
      required: true,
      message: 'At least one ingredient is required',
      trigger: 'change'
    },
    {
      validator: (_: any, value: string[], callback: (error?: Error) => void) => {
        if (!value || value.length === 0) {
          callback(new Error('At least one ingredient is required'))
        } else if (value.every((v: string) => v.trim() === '')) {
          callback(new Error('Ingredients cannot be empty'))
        } else {
          callback()
        }
      },
      trigger: 'submit'
    }
  ],
  instructions: [
    {
      required: true,
      message: 'At least one instruction is required',
      trigger: 'change'
    },
    {
      validator: (_: any, value: string[], callback: (error?: Error) => void) => {
        if (!value || value.length === 0) {
          callback(new Error('At least one instruction is required'))
        } else if (value.every((v: string) => v.trim() === '')) {
          callback(new Error('Instructions cannot be empty'))
        } else {
          callback()
        }
      },
      trigger: 'submit'
    }
  ]
}

// computed
const title = computed(() => (mode.value === 'edit' ? 'Edit Recipe' : 'Add Recipe'))

const CuisineOptions = computed(() => recipeStore.cuisineOptions)
const CategoryOptions = computed(() => recipeStore.categoryOptions)

// functions
const resetFormFields = () => {
  Object.assign(form, { ...DEFAULT_FORM })
  imageUrl.value = ''
  selectedFile.value = null
}

const handleRemove = () => {
  imageUrl.value = ''
  selectedFile.value = null
  form.image = ''
}

const handleFileChange: UploadProps['onChange'] = (uploadFile) => {
  const rawFile = uploadFile.raw!
  const isAllowed = ALLOWED_IMAGE_TYPES.includes(rawFile.type)
  const isLtInKB = rawFile.size / 1024 < MAX_IMAGE_SIZE_KB

  if (!isAllowed) {
    ElMessage.error('Only JPG/JPEG/PNG files are allowed')
    return
  }
  if (!isLtInKB) {
    ElMessage.error('Image must be smaller than 100KB')
    return
  }

  selectedFile.value = rawFile
  imageUrl.value = URL.createObjectURL(rawFile)
}

const submitForm = async () => {
  if (isSubmitting.value) return // Prevent spam clicks

  formRef.value?.validate(async (valid) => {
    if (!valid) return

    try {
      isSubmitting.value = true

      if (selectedFile.value) {
        const reader = new FileReader()
        form.image = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(selectedFile.value!)
        })
      }

      if (mode.value === 'add') {
        recipeStore.addCustomRecipe({ ...form })
        ElMessage.success('Recipe added')
      } else if (mode.value === 'edit') {
        recipeStore.updateRecipe(form.name, { ...form })
        ElMessage.success('Recipe updated')
      }

      emit('refresh')
      visible.value = false
    } catch (error) {
      console.error('Failed to save recipe:', error)
      ElMessage.error('Failed to save recipe')
    } finally {
      isSubmitting.value = false
    }
  })
}

// watch
watch(visible, (val) => {
  if (!val) {
    mode.value = 'add'
    resetFormFields()
  }
})

// expose
defineExpose({
  open: (type: 'add' | 'edit' = 'add', data?: Recipe) => {
    mode.value = type
    if (type === 'edit' && data) {
      Object.assign(form, { ...data })
      originalName.value = data.name
      imageUrl.value = data.image || ''
    } else {
      resetFormFields()
    }
    visible.value = true
  }
})
</script>
