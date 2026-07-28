<script setup>
import { computed } from 'vue'
import { useCountUp } from '../composables/useCountUp'

const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' },
  label: { type: String, required: true },
})

const { value: current, start } = useCountUp(props.value)
const display = computed(() => current.value.toLocaleString('en-US'))

defineExpose({ start })
</script>

<template>
  <div
    class="card group hover:ring-ink-300 dark:hover:ring-ink-700 p-4 transition duration-300 hover:-translate-y-1 sm:p-5"
  >
    <dt
      class="text-ink-900 dark:text-ink-50 text-2xl font-bold tracking-tight tabular-nums sm:text-3xl"
    >
      {{ display }}<span class="text-emerald-500">{{ suffix }}</span>
    </dt>
    <dd class="text-ink-500 dark:text-ink-400 mt-1 text-xs leading-snug sm:text-sm">
      {{ label }}
    </dd>
  </div>
</template>
