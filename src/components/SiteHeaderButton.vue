<script setup>
import AppIcon from './AppIcon.vue'

// The header's icon-only controls: same 9×9 hit target and hover treatment for
// print, motion and theme. `label` doubles as the tooltip and the accessible
// name, since an icon alone gives a screen reader nothing to read.
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  // null leaves aria-pressed off entirely — only toggles should carry it.
  pressed: { type: Boolean, default: null },
})
</script>

<template>
  <button
    type="button"
    class="text-ink-500 dark:text-ink-400 hover:bg-ink-200/60 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-white grid h-9 w-9 place-items-center rounded-lg transition-colors duration-200"
    :title="label"
    :aria-label="label"
    :aria-pressed="pressed"
  >
    <AppIcon :name="icon" :size="18" />
  </button>
</template>
