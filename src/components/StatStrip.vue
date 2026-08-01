<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { stats } from '../data/resume'
import { useSkin } from '../composables/useSkin'
import StatCounter from './StatCounter.vue'
import BobaStatCounter from './BobaStatCounter.vue'

const { skin } = useSkin()

// The one place a skin changes more than colour. Both counters take the same
// props and expose the same `start()`, so the strip doesn't care which is up —
// but a cup of boba can't be reached by re-declaring custom properties, so this
// is a swap rather than a restyle.
const counter = computed(() => (skin.value === 'boba' ? BobaStatCounter : StatCounter))

const root = ref(null)
const counters = ref([])
const seen = ref(false)
let observer = null

const startAll = () => counters.value.forEach((c) => c?.start())

// Start every counter together, the first time the strip scrolls into view.
onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      seen.value = true
      startAll()
      observer.disconnect()
    },
    { threshold: 0.3 },
  )
  observer.observe(root.value)
})

// Swapping the component unmounts every counter and mounts a fresh set at zero,
// with the observer long since disconnected — so the numbers would sit at 0
// until reload. Re-run them, but only once the strip has actually been seen:
// before that the observer still owns the first run.
watch(counter, async () => {
  if (!seen.value) return
  counters.value = []
  await nextTick()
  startAll()
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <dl ref="root" class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
    <component
      :is="counter"
      v-for="(stat, i) in stats"
      :key="stat.label"
      :ref="(el) => (counters[i] = el)"
      v-bind="stat"
      :index="i"
    />
  </dl>
</template>
