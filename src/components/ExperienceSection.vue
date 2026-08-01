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

// The oldest role's start year — the moment the lights went out.
const startYear = experience[experience.length - 1].start.split('-')[0]

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

        <!-- Start/finish line, sitting under the oldest role. -->
        <div v-reveal class="no-print mt-7 flex items-center gap-3">
          <span
            class="checkers checker-band text-ink-400 dark:text-ink-600 flex-1 rounded-[2px] [--checker-size:0.75rem]"
            aria-hidden="true"
          />
          <span
            class="text-ink-500 dark:text-ink-400 shrink-0 font-mono text-[0.7rem] tracking-[0.15em] uppercase"
          >
            Lights out · {{ startYear }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
