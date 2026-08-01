<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 16 },
})

// Stroked 24x24 paths, drawn with currentColor.
// A lookup table, kept one icon per line so it stays scannable.
// prettier-ignore
const PATHS = {
  mail: ['M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5z', 'm3.5 7 8.5 6 8.5-6'],
  phone: ['M4 5.5C4 4.7 4.7 4 5.5 4h2c.7 0 1.3.5 1.5 1.2l.7 2.8c.1.6-.1 1.2-.6 1.5l-1.3.9a12 12 0 0 0 5.8 5.8l.9-1.3c.4-.5.9-.7 1.5-.6l2.8.7c.7.2 1.2.8 1.2 1.5v2c0 .8-.7 1.5-1.5 1.5C10.6 20 4 13.4 4 5.5'],
  pin: ['M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11', 'M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5'],
  linkedin: ['M5.5 8.5v10M5.5 5.2v.1M10 18.5v-10M10 12.5c0-2 1.4-3.2 3.2-3.2S16.5 10.5 16.5 13v5.5'],
  link: ['M10.5 13.5a4 4 0 0 0 5.7 0l2.3-2.3a4 4 0 1 0-5.7-5.7l-1.3 1.3', 'M13.5 10.5a4 4 0 0 0-5.7 0l-2.3 2.3a4 4 0 1 0 5.7 5.7l1.3-1.3'],
  printer: ['M7 9V4h10v5', 'M7 18H5.5A2.5 2.5 0 0 1 3 15.5v-4A2.5 2.5 0 0 1 5.5 9h13a2.5 2.5 0 0 1 2.5 2.5v4a2.5 2.5 0 0 1-2.5 2.5H17', 'M7 15h10v5H7z'],
  sun: ['M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10', 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'],
  moon: ['M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5'],
  chevron: ['m7 10 5 5 5-5'],
  arrowUp: ['M12 19V5', 'm6 11 6-6 6 6'],
  check: ['m5 12.5 4.5 4.5L19 7.5'],
  close: ['M6 6l12 12M18 6 6 18'],
  spark: ['M12 3v5M12 16v5M3 12h5M16 12h5', 'm6.5 6.5 3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3'],
  cap: ['m3 9 9-4.5L21 9l-9 4.5z', 'M7 11v5c0 1.1 2.2 2 5 2s5-.9 5-2v-5'],
  badge: ['M12 14.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10', 'm8.5 13.5-1 7 4.5-2.2 4.5 2.2-1-7'],
  // Deliberately coarse — a 2×2 grid still reads as "checkered" at 11px.
  flag: ['M5 21V3.5', 'M5 3.5h14v9H5', 'M5 8h14M12 3.5v9'],
  stopwatch: ['M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16', 'M12 9v4l2.5 2', 'M9.5 2.5h5', 'm18.5 5.5 1.5-1.5'],
  gauge: ['M4 17a8 8 0 1 1 16 0', 'm12 13 4-3.5', 'M12 17a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4'],
  pause: ['M9.5 5.5v13M14.5 5.5v13'],
  play: ['M8 5.5v13l11-6.5z'],
  boba: ['M6.5 8h11l-1.1 11.3a1.7 1.7 0 0 1-1.7 1.5H9.3a1.7 1.7 0 0 1-1.7-1.5z', 'M5.5 8h13', 'm14 8 2-5', 'M10 16.8a1 1 0 1 0 0-2 1 1 0 0 0 0 2', 'M14 17.6a1 1 0 1 0 0-2 1 1 0 0 0 0 2', 'M11.6 19.6a1 1 0 1 0 0-2 1 1 0 0 0 0 2'],
}

const paths = computed(() => PATHS[props.name] ?? [])
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="shrink-0"
  >
    <path v-for="(d, i) in paths" :key="i" :d="d" />
  </svg>
</template>
