<script setup>
import { TAGS } from '../data/resume'
import { useFilters } from '../composables/useFilters'
import AppIcon from './AppIcon.vue'
import TagChip from './TagChip.vue'

const { tagCounts, hasFilters, isActive, toggle, clear } = useFilters()
const tagKeys = Object.keys(TAGS)

defineProps({
  visibleCount: { type: Number, required: true },
  totalCount: { type: Number, required: true },
})
</script>

<template>
  <div v-reveal class="no-print mb-8">
    <div class="flex flex-wrap items-center gap-2">
      <span
        class="text-ink-400 dark:text-ink-500 mr-1 font-mono text-[0.7rem] tracking-[0.15em] uppercase"
      >
        Filter
      </span>

      <TagChip
        v-for="tag in tagKeys"
        :key="tag"
        :tag="tag"
        :active="isActive(tag)"
        :count="tagCounts[tag]"
        interactive
        @click="toggle(tag)"
      />

      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0 scale-95"
        leave-active-class="transition duration-150"
        leave-to-class="opacity-0 scale-95"
      >
        <button
          v-if="hasFilters"
          type="button"
          class="text-ink-500 dark:text-ink-400 ring-ink-300 dark:ring-ink-700 hover:text-ink-900 dark:hover:text-white inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition duration-200"
          @click="clear"
        >
          <AppIcon name="close" :size="12" />
          Clear
        </button>
      </Transition>
    </div>

    <p
      v-if="hasFilters"
      class="text-ink-500 dark:text-ink-400 mt-3 text-sm"
      aria-live="polite"
    >
      Showing
      <span class="text-ink-900 dark:text-ink-50 font-semibold tabular-nums">
        {{ visibleCount }}
      </span>
      of {{ totalCount }} accomplishments.
    </p>
  </div>
</template>
