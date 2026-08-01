<script setup>
defineProps({
  index: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: null },
})
</script>

<template>
  <div v-reveal class="mb-8">
    <p
      class="mb-2 flex items-center gap-2.5 font-mono text-xs tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400"
    >
      <span
        class="checkers text-ink-800 dark:text-ink-100 h-3 w-6 shrink-0 rounded-[2px] [--checker-size:0.75rem]"
        aria-hidden="true"
      />
      {{ index }}
    </p>
    <h2
      class="text-ink-900 dark:text-ink-50 text-2xl font-bold tracking-tight sm:text-3xl"
    >
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      class="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl text-sm text-pretty"
    >
      {{ subtitle }}
    </p>
  </div>
</template>
