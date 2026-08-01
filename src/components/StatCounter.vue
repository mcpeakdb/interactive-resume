<script setup>
import { computed, useId } from 'vue'
import { useCountUp } from '../composables/useCountUp'

const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' },
  label: { type: String, required: true },
  index: { type: Number, default: 0 },
})

// ── Dial geometry, in viewBox units ──────────────────────────────────────────
// The needle pivots at the centre and travels SWEEP degrees, centred on
// straight up, so the face is symmetrical. Everything below is static, so it is
// built once at module scope rather than per card.
const CX = 50
const CY = 50
const R = 38
const SWEEP = 240
const START = -SWEEP / 2
const VIEW_H = 76
const REDLINE_AT = 0.85 // fraction of the sweep where the limiter zone starts

const polar = (deg, r) => [
  CX + r * Math.sin((deg * Math.PI) / 180),
  CY - r * Math.cos((deg * Math.PI) / 180),
]

const arc = (from, to, r) => {
  const [x1, y1] = polar(from, r)
  const [x2, y2] = polar(to, r)
  const large = to - from > 180 ? 1 : 0
  return `M${x1.toFixed(2)} ${y1.toFixed(2)}A${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

const TRACK = arc(START, START + SWEEP, R)
const LIMIT = arc(START + SWEEP * REDLINE_AT, START + SWEEP, R)
const NEEDLE = `M${CX} ${CY - 30}L${CX - 2.4} ${CY + 3}L${CX + 2.4} ${CY + 3}Z`

// Nine ticks across the face, every other one long.
const TICKS = Array.from({ length: 9 }, (_, i) => {
  const deg = START + (SWEEP / 8) * i
  const [x1, y1] = polar(deg, R - 6)
  const [x2, y2] = polar(deg, R - (i % 2 ? 9 : 12))
  return { x1, y1, x2, y2 }
})

// ── Reading ──────────────────────────────────────────────────────────────────
const { value: current, start } = useCountUp(props.value)
const display = computed(() => current.value.toLocaleString('en-US'))

const progress = computed(() => (props.value ? current.value / props.value : 1))
const angle = computed(() => START + SWEEP * progress.value)

// Sized off the target rather than the running total, so the readout doesn't
// change size mid-sweep. The mouth of the dial is only so wide — the longest
// numbers step down so they don't run out past the arc.
const readout = computed(() => {
  const width = props.value.toLocaleString('en-US').length + props.suffix.length
  if (width > 8) return 'text-base sm:text-lg'
  if (width > 5) return 'text-lg sm:text-xl'
  return 'text-xl sm:text-2xl'
})

// Once the number lands the needle stops sweeping and floats against the stop
// instead. Held off until then so the two motions don't fight over the same
// transform — the sweep rides the outer <g>, the flutter the inner one.
const settled = computed(() => current.value >= props.value)

// Each gauge idles on its own rhythm, so the strip reads as a row of separate
// engines rather than one dial repeated. The period step doesn't divide evenly
// into the base, so they keep drifting apart instead of re-syncing after a few
// cycles; the delay is negative so each one starts mid-stroke rather than
// waiting its turn at a standstill.
const idle = computed(() => ({
  animationDuration: `${(1.7 + props.index * 0.13).toFixed(2)}s`,
  animationDelay: `-${(props.index * 0.37).toFixed(2)}s`,
}))

// Gradient ids are document-global, so each card needs its own.
const sweepId = `sweep-${useId()}`

defineExpose({ start })
</script>

<template>
  <div
    class="card streak group hover:ring-ink-300 dark:hover:ring-ink-700 p-4 text-center transition duration-300 hover:-translate-y-1 sm:p-5"
  >
    <!-- The dial is decoration: the reading it shows is the <dt> below it. -->
    <svg
      class="no-print mx-auto block h-24 w-auto"
      :viewBox="`0 0 100 ${VIEW_H}`"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="sweepId" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" style="stop-color: var(--color-emerald-500)" />
          <stop offset="100%" style="stop-color: var(--color-race-500)" />
        </linearGradient>
      </defs>

      <path
        :d="TRACK"
        class="stroke-ink-200 dark:stroke-ink-800"
        stroke-width="5"
        stroke-linecap="round"
      />
      <!-- Limiter zone, so the needle's resting place reads as the red end. -->
      <path
        :d="LIMIT"
        class="stroke-race-500 dark:stroke-race-400"
        stroke-width="5"
        stroke-linecap="round"
        stroke-opacity="0.35"
      />

      <g
        class="stroke-ink-300 dark:stroke-ink-700"
        stroke-width="1.4"
        stroke-linecap="round"
      >
        <line
          v-for="(t, i) in TICKS"
          :key="i"
          :x1="t.x1"
          :y1="t.y1"
          :x2="t.x2"
          :y2="t.y2"
        />
      </g>

      <!-- The sweep is one dash on the full track, so it fills as the count
           climbs without any per-frame path maths. -->
      <path
        :d="TRACK"
        :stroke="`url(#${sweepId})`"
        stroke-width="5"
        stroke-linecap="round"
        pathLength="100"
        stroke-dasharray="100"
        :stroke-dashoffset="100 - progress * 100"
      />

      <g :transform="`rotate(${angle.toFixed(2)} ${CX} ${CY})`">
        <g :class="{ redline: settled }" :style="settled ? idle : null">
          <path :d="NEEDLE" class="fill-race-500 dark:fill-race-400" />
        </g>
      </g>
      <circle :cx="CX" :cy="CY" r="3.4" class="fill-ink-300 dark:fill-ink-700" />
      <circle :cx="CX" :cy="CY" r="1.4" class="fill-white dark:fill-ink-900" />
    </svg>

    <dt
      class="gauge-readout text-ink-900 dark:text-ink-50 -mt-7 font-bold tracking-tight tabular-nums sm:-mt-8"
      :class="readout"
    >
      {{ display }}<span class="text-emerald-500">{{ suffix }}</span>
    </dt>
    <dd class="text-ink-500 dark:text-ink-400 mt-1 text-xs leading-snug sm:text-sm">
      {{ label }}
    </dd>
  </div>
</template>
