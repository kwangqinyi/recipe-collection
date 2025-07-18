<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div
    class="sticky z-20 h-[70px] px-4 mb-8 bg-white flex gap-4 justify-end items-center rounded-2xl shadow-md"
    :class="isScrolled ? 'top-0' : 'top-4'"
  >
    <div class="flex items-center gap-3">
      <div>Encoremed assessment</div>
      <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
        <svg
          class="absolute w-12 h-12 text-gray-400 -left-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>

      <div class="text-right">
        <div class="font-semibold">Kwang</div>
      </div>
    </div>
  </div>
</template>
