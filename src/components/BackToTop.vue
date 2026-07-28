<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const show = ref(false)
const onScroll = () => (show.value = window.scrollY > 600)
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0 translate-y-3"
    leave-active-class="transition duration-200"
    leave-to-class="opacity-0 translate-y-3"
  >
    <button
      v-if="show"
      type="button"
      class="no-print dark:bg-ink-50 dark:text-ink-950 bg-ink-900 fixed right-5 bottom-5 z-40 grid h-11 w-11 place-items-center rounded-full text-white shadow-lg transition-transform duration-200 hover:-translate-y-1"
      aria-label="Back to top"
      @click="toTop"
    >
      <AppIcon name="arrowUp" :size="18" />
    </button>
  </Transition>
</template>
