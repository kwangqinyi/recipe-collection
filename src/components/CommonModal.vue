<template>
  <el-dialog v-model="visible" :title="title" width="400px" :close-on-click-modal="false">
    <div>{{ message }}</div>

    <template #footer>
      <el-button @click="visible = false" round>Cancel</el-button>
      <el-button type="primary" @click="confirm" round>Confirm</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const title = ref('Confirmation')
const message = ref('Are you sure?')

const confirmCallback = ref<(() => void) | null>(null)

const open = (options: { title?: string; message: string; onConfirm: () => void }) => {
  title.value = options.title || 'Confirmation'
  message.value = options.message
  confirmCallback.value = options.onConfirm
  visible.value = true
}

const confirm = () => {
  confirmCallback.value?.()
  visible.value = false
}

defineExpose({ open })
</script>
