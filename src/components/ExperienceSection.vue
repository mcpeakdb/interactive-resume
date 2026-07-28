<script setup>
import { computed, ref, watch } from 'vue'
import { experience } from '../data/resume'
import { useFilters } from '../composables/useFilters'
import FilterBar from './FilterBar.vue'
import JobCard from './JobCard.vue'
import SectionHeading from './SectionHeading.vue'

const { hasFilters, matches, countMatches } = useFilters()

// The current role starts open; everything else is one click away.
const openIds = ref(new Set([experience[0].id]))

function toggle(id) {
  const next = new Set(openIds.value)
  next.has(id) ? next.delete(id) : next.add(id)
  openIds.value = next
}

// Filtering is only useful if the matching cards are actually showing.
watch(hasFilters, (on) => {
  openIds.value = on
    ? new Set(experience.filter((j) => countMatches(j) > 0).map((j) => j.id))
    : new Set([experience[0].id])
})

const totalCount = computed(() =>
  experience.reduce((n, job) => n + job.highlights.length + job.projects.length, 0),
)

const visibleCount = computed(() =>
  experience.reduce(
    (n, job) => n + [...job.highlights, ...job.projects].filter(matches).length,
    0,
  ),
)
</script>

<template>
  <section id="experience" class="scroll-mt-24 py-16">
    <div class="section-shell">
      <SectionHeading
        index="02 — Track record"
        title="Experience"
        subtitle="Over a decade from data-center infrastructure to leading full-stack delivery. Expand a card for the detail, or filter by discipline above."
      />

      <FilterBar :visible-count="visibleCount" :total-count="totalCount" />

      <!-- Vertical rail behind the timeline nodes on the job cards. -->
      <div class="relative sm:pl-10">
        <span
          class="no-print via-ink-200 dark:via-ink-800 absolute top-2 bottom-2 left-1.5 hidden w-px bg-gradient-to-b from-emerald-500/60 to-transparent sm:block"
          aria-hidden="true"
        />
        <div class="space-y-5">
          <JobCard
            v-for="(job, i) in experience"
            :key="job.id"
            v-reveal="i * 80"
            :job="job"
            :expanded="openIds.has(job.id)"
            @toggle="toggle(job.id)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
