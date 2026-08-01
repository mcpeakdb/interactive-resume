<script setup>
import { computed } from 'vue'
import { useFilters } from '../composables/useFilters'
import AppIcon from './AppIcon.vue'
import TagChip from './TagChip.vue'

const props = defineProps({
  job: { type: Object, required: true },
  expanded: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])

const { hasFilters, matches, countMatches } = useFilters()

const visibleHighlights = computed(() => props.job.highlights.filter(matches))
const visibleProjects = computed(() => props.job.projects.filter(matches))
const matchCount = computed(() => countMatches(props.job))
const dimmed = computed(() => hasFilters.value && matchCount.value === 0)

const span = computed(() => {
  const fmt = (iso) => {
    const [y, m] = iso.split('-')
    return new Date(Number(y), Number(m) - 1).toLocaleString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }
  return `${fmt(props.job.start)} – ${props.job.end ? fmt(props.job.end) : 'Present'}`
})

const duration = computed(() => {
  const [sy, sm] = props.job.start.split('-').map(Number)
  const endDate = props.job.end
    ? props.job.end.split('-').map(Number)
    : [new Date().getFullYear(), new Date().getMonth() + 1]
  const months = (endDate[0] - sy) * 12 + (endDate[1] - sm)
  const years = Math.floor(months / 12)
  const rest = months % 12
  return [years && `${years} yr${years > 1 ? 's' : ''}`, rest && `${rest} mo`]
    .filter(Boolean)
    .join(' ')
})
</script>

<template>
  <article
    class="card relative transition-all duration-300"
    :class="
      dimmed ? 'opacity-40 saturate-0' : 'hover:ring-ink-300 dark:hover:ring-ink-700'
    "
  >
    <!-- Timeline node, aligned to the rail drawn by ExperienceSection. The
         current role flies the green flag; finished stints get the checker. -->
    <span
      class="no-print absolute top-8 -left-[1.9rem] hidden h-3 w-3 ring-4 sm:block"
      :class="
        job.current
          ? 'rounded-full bg-emerald-500 ring-emerald-500/20'
          : 'checkers text-ink-500 dark:text-ink-400 ring-ink-50 dark:ring-ink-950 rounded-[2px] [--checker-size:0.375rem]'
      "
      aria-hidden="true"
    />

    <button
      type="button"
      class="streak flex w-full items-start gap-4 rounded-t-2xl p-5 text-left sm:p-6"
      :aria-expanded="expanded"
      :aria-controls="`${job.id}-detail`"
      @click="emit('toggle')"
    >
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 class="text-ink-900 dark:text-ink-50 text-lg font-semibold tracking-tight">
            {{ job.company }}
          </h3>
          <span
            v-if="job.current"
            class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.7rem] font-semibold text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-300"
          >
            <AppIcon name="flag" :size="11" />
            On track
          </span>
        </div>

        <p
          class="text-ink-500 dark:text-ink-400 mt-1 flex flex-wrap items-center gap-x-2 text-sm"
        >
          <span>{{ job.location }}</span>
          <span aria-hidden="true">·</span>
          <span class="tabular-nums">{{ span }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ duration }}</span>
        </p>

        <ul class="mt-3 space-y-1">
          <li
            v-for="role in job.roles"
            :key="role.title"
            class="text-ink-700 dark:text-ink-200 flex flex-wrap items-baseline gap-x-2 text-sm"
          >
            <span class="font-medium">{{ role.title }}</span>
            <span class="text-ink-500 dark:text-ink-400 text-xs">{{ role.period }}</span>
          </li>
        </ul>
      </div>

      <span
        class="no-print text-ink-500 dark:text-ink-400 mt-1 flex shrink-0 items-center gap-2 text-xs"
      >
        <span v-if="hasFilters" class="tabular-nums"
          >{{ matchCount }} match{{ matchCount === 1 ? '' : 'es' }}</span
        >
        <AppIcon
          name="chevron"
          :size="20"
          class="transition-transform duration-300"
          :class="expanded && 'rotate-180'"
        />
      </span>
    </button>

    <!-- 0fr → 1fr gives a height transition without measuring the content. -->
    <div
      :id="`${job.id}-detail`"
      class="print-expand grid transition-[grid-template-rows] duration-400 ease-out"
      :class="expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="overflow-hidden">
        <div class="border-ink-200 dark:border-ink-800 mx-5 border-t pt-5 pb-6 sm:mx-6">
          <p v-if="dimmed" class="text-ink-500 dark:text-ink-400 text-sm italic">
            Nothing here matches the current filter.
          </p>

          <template v-else>
            <ul class="space-y-3">
              <li
                v-for="item in visibleHighlights"
                :key="item.text"
                class="flex gap-3 text-sm leading-relaxed"
              >
                <AppIcon name="check" :size="15" class="mt-1 text-emerald-500" />
                <span class="min-w-0">
                  <span class="text-ink-700 dark:text-ink-200">{{ item.text }}</span>
                  <span class="ml-2 inline-flex flex-wrap gap-1 align-middle">
                    <TagChip v-for="tag in item.tags" :key="tag" :tag="tag" />
                  </span>
                </span>
              </li>
            </ul>

            <div v-if="visibleProjects.length" class="mt-6">
              <h4
                class="text-ink-500 dark:text-ink-400 mb-3 flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.15em] uppercase"
              >
                <AppIcon name="spark" :size="13" />
                Major projects
              </h4>
              <ul class="grid gap-3 sm:grid-cols-2">
                <li
                  v-for="project in visibleProjects"
                  :key="project.name"
                  class="bg-ink-100/60 dark:bg-ink-950/50 ring-ink-200/70 dark:ring-ink-800/70 rounded-xl p-4 ring-1 transition duration-200 hover:-translate-y-0.5"
                >
                  <p class="text-ink-900 dark:text-ink-50 text-sm font-semibold">
                    {{ project.name }}
                  </p>
                  <p
                    class="text-ink-600 dark:text-ink-400 mt-1.5 text-sm leading-relaxed"
                  >
                    {{ project.detail }}
                  </p>
                  <div class="mt-3 flex flex-wrap gap-1">
                    <TagChip v-for="tag in project.tags" :key="tag" :tag="tag" />
                  </div>
                </li>
              </ul>
            </div>

            <a
              v-if="job.url"
              :href="job.url"
              target="_blank"
              rel="noreferrer"
              class="no-print text-ink-500 dark:text-ink-400 mt-5 inline-flex items-center gap-1.5 text-sm hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              <AppIcon name="link" :size="14" />
              {{ job.site }}
            </a>
          </template>
        </div>
      </div>
    </div>
  </article>
</template>
