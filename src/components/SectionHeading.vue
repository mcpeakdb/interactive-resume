<script setup>
defineProps({
  index: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: null },
})
</script>

<template>
  <div v-reveal class="mb-8">
    <p class="mb-2 font-mono text-xs tracking-[0.2em] text-emerald-600 uppercase dark:text-emerald-400">
      {{ index }}
    </p>
    <h2 class="text-ink-900 dark:text-ink-50 text-2xl font-bold tracking-tight sm:text-3xl">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl text-sm text-pretty">
      {{ subtitle }}
    </p>
  </div>
</template>
