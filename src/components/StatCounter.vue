<script setup>
import { computed } from 'vue'
import { useCountUp } from '../composables/useCountUp'

const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' },
  label: { type: String, required: true },
  index: { type: Number, default: 0 },
})

const { value: current, start } = useCountUp(props.value)
const display = computed(() => current.value.toLocaleString('en-US'))

// Drives the telemetry bar, so it sweeps in step with the number. Scale rather
// than width, so the redline loop below never costs a layout.
const scale = computed(() => (props.value ? current.value / props.value : 1))

// Once the number lands the needle stops sitting flat and idles near the
// limiter instead. Held off until then so the two motions don't fight over
// the same transform.
const settled = computed(() => current.value >= props.value)

// Each gauge idles on its own rhythm, so the strip reads as a row of separate
// engines rather than one bar repeated. The period step doesn't divide evenly
// into the base, so they keep drifting apart instead of re-syncing after a few
// cycles; the delay is negative so each one starts mid-stroke rather than
// waiting its turn at a standstill.
const idle = computed(() => ({
  animationDuration: `${(1.7 + props.index * 0.13).toFixed(2)}s`,
  animationDelay: `-${(props.index * 0.37).toFixed(2)}s`,
}))

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

    <!-- Telemetry bar — sweeps up with the counter, then holds at redline. -->
    <div
      class="bg-ink-200/70 dark:bg-ink-800/70 no-print mt-3 h-1 overflow-hidden rounded-full"
      aria-hidden="true"
    >
      <div
        class="to-race-500 h-full w-full origin-left rounded-full bg-gradient-to-r from-emerald-500"
        :class="{ redline: settled }"
        :style="settled ? idle : { transform: `scaleX(${scale})` }"
      />
    </div>
  </div>
</template>
