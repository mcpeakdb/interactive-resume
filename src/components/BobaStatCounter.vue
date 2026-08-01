<script setup>
/**
 * One headline stat, drawn as a cup of boba — the boba skin's stand-in for
 * StatCounter's speedometer. StatStrip picks between the two.
 *
 * Same contract as StatCounter: same props, `start()` exposed for the strip's
 * IntersectionObserver, the cup is `aria-hidden` decoration and the accessible
 * content is the <dt>/<dd> pair.
 *
 * This one is only ever mounted under `data-skin="boba"`, which is what lets it
 * name colours plainly: emerald resolves to taro, race to brown sugar and the
 * ink ramp to oat-milk creams. Under any other skin those would read as the
 * wrong drink entirely — hence a separate component rather than a variant.
 *
 * The tea rises with the count, so the pearls heaped at the bottom surface
 * first and the cup lands full. Everything inside the cup is clipped to its
 * outline, so the liquid, the pearls and the bubbles are all drawn as plain
 * shapes and the cup shape is only described once.
 */
import { computed, useId } from 'vue'
import { useCountUp } from '../composables/useCountUp'

const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' },
  label: { type: String, required: true },
  // Position in the strip. Only used to stagger the bubbles — see `bubble()`.
  index: { type: Number, default: 0 },
})

// ── Cup geometry, in viewBox units ───────────────────────────────────────────
// A tapered takeaway cup: wider at the lid than at the base, with the bottom
// corners rounded off. Static, so it is built once at module scope.
const CUP = 'M13 24L23 90Q24 96 30 96L70 96Q76 96 77 90L87 24Z'

// The tea never quite reaches the lid — the headroom is what makes it read as
// a drink rather than a filled bar.
const FILL_TOP = 30
const FILL_BOTTOM = 96

// Pearls heaped in the base, widest row at the bottom. The offsets are a cheap
// deterministic jitter: a real heap doesn't sit on a grid, but it shouldn't
// reshuffle on every render either.
const PEARL_ROWS = [
  { y: 88, xs: [30, 40, 50, 60, 70] },
  { y: 79, xs: [35, 45, 55, 65] },
  { y: 70.5, xs: [40, 50, 60] },
]

const PEARLS = PEARL_ROWS.flatMap((row, r) =>
  row.xs.map((x, i) => ({
    cx: x + (((i + r) % 3) - 1) * 0.9,
    cy: row.y + (((i * 2 + r) % 3) - 1) * 0.8,
    r: 4.4 + (((i + r * 2) % 3) - 1) * 0.35,
  })),
)

// Three bubbles on different rhythms. They rise the full height of the cup and
// are clipped at the surface, so they pop at whatever level the tea has reached
// rather than needing to know it.
const BUBBLES = [
  { cx: 36, r: 2.2, dur: 3.4 },
  { cx: 52, r: 1.5, dur: 4.2 },
  { cx: 64, r: 1.9, dur: 3.8 },
]

// ── Reading ──────────────────────────────────────────────────────────────────
// `start` is exposed rather than called here: StatStrip fires every counter at
// once from a single IntersectionObserver, so the whole row fills together.
const { value: current, start } = useCountUp(props.value)
const display = computed(() => current.value.toLocaleString('en-US'))

// 0 → 1 across the count, driving the one thing that moves with it: the top
// edge of the tea. The rect below it is oversized and clipped, so only this
// edge has to be positioned.
const progress = computed(() => (props.value ? current.value / props.value : 1))
const level = computed(() => FILL_BOTTOM - progress.value * (FILL_BOTTOM - FILL_TOP))

// Each cup fizzes on its own rhythm, so the strip reads as a row of separate
// drinks rather than one cup repeated. The negative delay starts every bubble
// part-way up its climb instead of holding them all at the bottom for the first
// cycle; the per-card offsets don't divide evenly into the durations, so they
// keep drifting apart rather than re-syncing.
const bubble = (b, i) => ({
  animationDuration: `${(b.dur + props.index * 0.17).toFixed(2)}s`,
  animationDelay: `-${(i * 1.3 + props.index * 0.41).toFixed(2)}s`,
})

// clipPath and gradient ids are document-global, so each cup needs its own.
const uid = useId()
const clipId = `cup-${uid}`
const teaId = `tea-${uid}`

defineExpose({ start })
</script>

<template>
  <!-- Root is a plain <div> because the parent is a <dl>: the dt/dd pair below
       has to stay a direct child of this wrapper for the list to be valid. -->
  <div
    class="card streak group hover:ring-ink-300 dark:hover:ring-ink-700 p-4 text-center transition duration-300 hover:-translate-y-1 sm:p-5"
  >
    <!-- The cup is decoration: the reading it shows is the <dt> below it.
         It doesn't print either — on paper this collapses to number + label. -->
    <svg
      class="no-print mx-auto block h-24 w-auto sm:h-28"
      viewBox="0 0 100 104"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath :id="clipId">
          <path :d="CUP" />
        </clipPath>
        <!-- userSpaceOnUse pins the gradient to the cup rather than to the
             liquid's own box, so the tea doesn't restripe as it rises. Stops
             resolve through the theme custom properties, so the skin owns the
             colour and this file never names a hex. -->
        <linearGradient
          :id="teaId"
          gradientUnits="userSpaceOnUse"
          x1="0"
          :y1="FILL_TOP"
          x2="0"
          :y2="FILL_BOTTOM"
        >
          <stop offset="0%" style="stop-color: var(--color-emerald-400)" />
          <stop offset="100%" style="stop-color: var(--color-emerald-600)" />
        </linearGradient>
      </defs>

      <!-- Empty cup: a faint wash, so it reads as a vessel before it fills. -->
      <path
        :d="CUP"
        class="fill-ink-200 dark:fill-ink-800"
        fill-opacity="0.55"
        fill-rule="nonzero"
      />

      <g :clip-path="`url(#${clipId})`">
        <!-- Tall enough to cover the cup from `level` down, whatever the fill. -->
        <rect x="0" :y="level" width="100" height="80" :fill="`url(#${teaId})`" />
        <circle
          v-for="(p, i) in PEARLS"
          :key="i"
          :cx="p.cx"
          :cy="p.cy"
          :r="p.r"
          class="fill-race-600 dark:fill-race-500"
        />
        <circle
          v-for="(b, i) in BUBBLES"
          :key="`b${i}`"
          class="boba-bubble fill-ink-50"
          :cx="b.cx"
          :cy="FILL_BOTTOM - 4"
          :r="b.r"
          :style="bubble(b, i)"
        />
      </g>

      <!-- Outline last of the cup layers, so it caps the clipped edges. -->
      <path
        :d="CUP"
        class="stroke-ink-300 dark:stroke-ink-700"
        stroke-width="2.5"
        stroke-linejoin="round"
      />

      <!-- Sealed lid, then the straw over everything: a straw drawn behind the
           tea would read as standing behind the cup instead of in it. -->
      <rect
        x="9"
        y="14"
        width="82"
        height="9"
        rx="3"
        class="fill-ink-300 dark:fill-ink-700"
      />
      <rect
        x="54"
        y="2"
        width="9"
        height="72"
        rx="4.5"
        transform="rotate(10 50 50)"
        class="fill-race-400 dark:fill-race-500"
      />
    </svg>

    <dt
      class="text-ink-900 dark:text-ink-50 mt-2 text-xl font-bold tracking-tight tabular-nums sm:text-2xl"
    >
      {{ display }}<span class="text-emerald-500">{{ suffix }}</span>
    </dt>
    <dd class="text-ink-500 dark:text-ink-400 mt-1 text-xs leading-snug sm:text-sm">
      {{ label }}
    </dd>
  </div>
</template>
