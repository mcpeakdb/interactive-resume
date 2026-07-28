import { computed, ref } from 'vue'
import { TAGS, experience } from '../data/resume'

/**
 * Shared filter state. The chip bar, the skill chips and the experience cards
 * all read and write this, so clicking "Vue.js" in Skills filters Experience.
 */
const activeTags = ref(new Set())

/** How many bullets + projects across the whole resume carry each tag. */
const tagCounts = computed(() => {
  const counts = {}
  for (const key of Object.keys(TAGS)) counts[key] = 0
  for (const job of experience) {
    for (const item of [...job.highlights, ...job.projects]) {
      for (const tag of item.tags) counts[tag] = (counts[tag] ?? 0) + 1
    }
  }
  return counts
})

export function useFilters() {
  const isActive = (tag) => activeTags.value.has(tag)
  const hasFilters = computed(() => activeTags.value.size > 0)

  function toggle(tag) {
    const next = new Set(activeTags.value)
    next.has(tag) ? next.delete(tag) : next.add(tag)
    activeTags.value = next
  }

  function clear() {
    activeTags.value = new Set()
  }

  /** An item matches when it carries at least one active tag (OR semantics). */
  function matches(item) {
    if (!hasFilters.value) return true
    return item.tags.some((tag) => activeTags.value.has(tag))
  }

  /** Number of items in a job that survive the current filter. */
  function countMatches(job) {
    if (!hasFilters.value) return job.highlights.length + job.projects.length
    return [...job.highlights, ...job.projects].filter(matches).length
  }

  return {
    activeTags,
    tagCounts,
    hasFilters,
    isActive,
    toggle,
    clear,
    matches,
    countMatches,
  }
}
