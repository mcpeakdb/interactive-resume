<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { stats } from '../data/resume'
import StatCounter from './StatCounter.vue'

const root = ref(null)
const counters = ref([])
let observer = null

// Start every counter together, the first time the strip scrolls into view.
onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      counters.value.forEach((c) => c?.start())
      observer.disconnect()
    },
    { threshold: 0.3 },
  )
  observer.observe(root.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <dl ref="root" class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
    <StatCounter
      v-for="(stat, i) in stats"
      :key="stat.label"
      :ref="(el) => (counters[i] = el)"
      v-bind="stat"
    />
  </dl>
</template>
