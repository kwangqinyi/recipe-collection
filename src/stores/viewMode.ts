import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useViewModeStore = defineStore(
  'viewMode',
  () => {
    const mode = ref<'table' | 'grid'>('table')

    const setMode = (newMode: 'grid' | 'table') => {
      mode.value = newMode
    }

    return {
      mode,
      setMode
    }
  },
  {
    persist: true
  }
)
