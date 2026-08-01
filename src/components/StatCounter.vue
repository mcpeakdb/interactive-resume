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

// Drives the telemetry bar, so it sweeps in step with the number.
const progress = computed(() => (props.value ? (current.value / props.value) * 100 : 100))

defineExpose({ start })
</script>

<template>
  <div
    class="card streak group hover:ring-ink-300 dark:hover:ring-ink-700 p-4 transition duration-300 hover:-translate-y-1 sm:p-5"
  >
    <dt
      class="text-ink-900 dark:text-ink-50 text-2xl font-bold tracking-tight tabular-nums sm:text-3xl"
    >
      {{ display }}<span class="text-emerald-500">{{ suffix }}</span>
    </dt>
    <dd class="text-ink-500 dark:text-ink-400 mt-1 text-xs leading-snug sm:text-sm">
      {{ label }}
    </dd>

    <!-- Telemetry bar — sweeps up with the counter, like a gauge settling. -->
    <div
      class="bg-ink-200/70 dark:bg-ink-800/70 no-print mt-3 h-1 overflow-hidden rounded-full"
      aria-hidden="true"
    >
      <div
        class="to-race-500 h-full rounded-full bg-gradient-to-r from-emerald-500"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>
