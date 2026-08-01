<script setup>
/**
 * One headline stat, drawn as a speedometer.
 *
 * The card is a dial: the arc fills and the needle sweeps from rest to the
 * stat's value while the number counts up underneath, then the needle settles
 * against the limiter and flutters there. Nothing here is interactive — the
 * SVG is decoration, and the accessible content is the <dt>/<dd> pair, which
 * is why the dial carries `aria-hidden` and the number is real text.
 *
 * Motion is split across two layers on purpose:
 *   sweep   — an SVG `transform` attribute on the outer <g>, updated per frame
 *             from the count-up.
 *   flutter — a CSS animation (`.redline`) on an inner <g>.
 * They're separate elements because both want `transform`, and separate
 * mechanisms because the reduced-motion and .motion-still rules in style.css
 * kill CSS transforms outright: that stops the flutter, while the sweep — a
 * presentation attribute nothing in CSS targets — survives and keeps the needle
 * parked at the correct reading instead of snapping back to zero.
 */
import { computed, useId } from 'vue'
import { useCountUp } from '../composables/useCountUp'

const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' },
  label: { type: String, required: true },
  // Position in the strip. Only used to stagger the idle flutter — see `idle`.
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
// Taller than the arc needs: 240° leaves the dial open at the bottom, and the
// readout is tucked up into that mouth by a negative margin in the template.
const VIEW_H = 76
const REDLINE_AT = 0.85 // fraction of the sweep where the limiter zone starts

// Angles are clock-style — 0° is straight up, positive is clockwise — because
// that's how a gauge is read. SVG's y axis grows downward, hence the minus.
const polar = (deg, r) => [
  CX + r * Math.sin((deg * Math.PI) / 180),
  CY - r * Math.cos((deg * Math.PI) / 180),
]

// An arc between two angles. The sweep flag is always 1 (clockwise on screen,
// matching `polar`); the large-arc flag has to be worked out, since anything
// past a half turn takes the long way round.
const arc = (from, to, r) => {
  const [x1, y1] = polar(from, r)
  const [x2, y2] = polar(to, r)
  const large = to - from > 180 ? 1 : 0
  return `M${x1.toFixed(2)} ${y1.toFixed(2)}A${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

const TRACK = arc(START, START + SWEEP, R)
const LIMIT = arc(START + SWEEP * REDLINE_AT, START + SWEEP, R)
// Drawn pointing straight up and rotated into place. It runs a little past the
// pivot so the tail shows on the far side; the hub circles cover the join.
const NEEDLE = `M${CX} ${CY - 30}L${CX - 2.4} ${CY + 3}L${CX + 2.4} ${CY + 3}Z`

// Nine ticks across the face, every other one long.
const TICKS = Array.from({ length: 9 }, (_, i) => {
  const deg = START + (SWEEP / 8) * i
  const [x1, y1] = polar(deg, R - 6)
  const [x2, y2] = polar(deg, R - (i % 2 ? 9 : 12))
  return { x1, y1, x2, y2 }
})

// ── Reading ──────────────────────────────────────────────────────────────────
// `start` is exposed rather than called here: StatStrip fires every counter at
// once from a single IntersectionObserver, so the whole row sweeps together.
const { value: current, start } = useCountUp(props.value)
const display = computed(() => current.value.toLocaleString('en-US'))

// 0 → 1 across the count. Everything the dial draws is a function of this, so
// the arc and the needle can't drift out of step with the number.
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
  <!-- Root is a plain <div> because the parent is a <dl>: the dt/dd pair below
       has to stay a direct child of this wrapper for the list to be valid. -->
  <div
    class="card streak group hover:ring-ink-300 dark:hover:ring-ink-700 p-4 text-center transition duration-300 hover:-translate-y-1 sm:p-5"
  >
    <!-- The dial is decoration: the reading it shows is the <dt> below it.
         It doesn't print either — on paper this collapses to number + label. -->
    <svg
      class="no-print mx-auto block h-24 w-auto"
      :viewBox="`0 0 100 ${VIEW_H}`"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <!-- Stops resolve through the theme custom properties rather than
             hard-coded hex, so a skin repaints the sweep along with everything
             else. Diagonal, so the gradient runs across the arc, not down it. -->
        <linearGradient :id="sweepId" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" style="stop-color: var(--color-emerald-500)" />
          <stop offset="100%" style="stop-color: var(--color-race-500)" />
        </linearGradient>
      </defs>

      <!-- Unlit track. -->
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

      <!-- Stroke styling sits on the group so the ticks stay one-line each. -->
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

      <!-- The sweep is one dash on the full track: `pathLength` renormalises
           the path to 100 units whatever its real length, so the offset is the
           percentage remaining and no per-frame path maths is needed. -->
      <path
        :d="TRACK"
        :stroke="`url(#${sweepId})`"
        stroke-width="5"
        stroke-linecap="round"
        pathLength="100"
        stroke-dasharray="100"
        :stroke-dashoffset="100 - progress * 100"
      />

      <!-- Outer <g> carries the reading, inner <g> the flutter once it lands.
           See the two-layer note at the top of the file. -->
      <g :transform="`rotate(${angle.toFixed(2)} ${CX} ${CY})`">
        <g :class="{ redline: settled }" :style="settled ? idle : null">
          <path :d="NEEDLE" class="fill-race-500 dark:fill-race-400" />
        </g>
      </g>
      <!-- Hub, drawn last so it caps the needle's tail. -->
      <circle :cx="CX" :cy="CY" r="3.4" class="fill-ink-300 dark:fill-ink-700" />
      <circle :cx="CX" :cy="CY" r="1.4" class="fill-white dark:fill-ink-900" />
    </svg>

    <!-- Negative margin lifts the readout into the open bottom of the dial.
         `.gauge-readout` is the print hook that undoes it once the dial is
         hidden; `tabular-nums` keeps the digits from jittering as they climb. -->
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
