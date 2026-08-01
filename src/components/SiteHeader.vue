<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { profile, sections } from '../data/resume'
import { useMotion } from '../composables/useMotion'
import { useScrollSpy } from '../composables/useScrollSpy'
import { useTheme } from '../composables/useTheme'
import SiteHeaderButton from './SiteHeaderButton.vue'

const { active } = useScrollSpy(sections.map((s) => s.id))
const { isDark, toggle } = useTheme()
const { isStill, toggle: toggleMotion } = useMotion()

const scrolled = ref(false)
const progress = ref(0)
const print = () => window.print()

// Lap progress: how far through the page you are, 0–100.
function onScroll() {
  scrolled.value = window.scrollY > 24
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min((window.scrollY / max) * 100, 100) : 0
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <header
    class="no-print sticky top-0 z-50 transition-all duration-300"
    :class="
      scrolled
        ? 'bg-ink-50/80 dark:bg-ink-950/80 ring-ink-200/70 dark:ring-ink-800/70 shadow-sm ring-1 backdrop-blur-xl'
        : 'bg-transparent'
    "
  >
    <div class="section-shell flex h-16 items-center gap-4">
      <a
        href="#about"
        class="text-ink-900 dark:text-ink-50 group flex items-center gap-2 text-sm font-semibold tracking-tight"
      >
        <span
          class="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-105"
        >
          DM
        </span>
        <span class="hidden sm:inline">{{ profile.name }}</span>
      </a>

      <nav class="ml-auto hidden items-center gap-1 md:flex" aria-label="Sections">
        <a
          v-for="section in sections"
          :key="section.id"
          :href="`#${section.id}`"
          class="relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200"
          :class="
            active === section.id
              ? 'text-ink-900 dark:text-white'
              : 'text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-100'
          "
          :aria-current="active === section.id ? 'true' : null"
        >
          {{ section.label }}
          <span
            v-if="active === section.id"
            class="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
          />
        </a>
      </nav>

      <div class="ml-auto flex items-center gap-1 md:ml-0">
        <SiteHeaderButton icon="printer" label="Print or save as PDF" @click="print" />
        <SiteHeaderButton
          :icon="isStill ? 'play' : 'pause'"
          :label="isStill ? 'Resume animations' : 'Pause animations'"
          :pressed="isStill"
          @click="toggleMotion"
        />
        <SiteHeaderButton
          :icon="isDark ? 'sun' : 'moon'"
          :label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggle"
        />
      </div>
    </div>

    <!-- Lap progress. The track runs green-flag emerald and heats to red as it
         approaches the checkered flag pinned at the finish. -->
    <div class="absolute inset-x-0 bottom-0 h-1 overflow-hidden" aria-hidden="true">
      <div class="bg-ink-200/50 dark:bg-ink-800/50 absolute inset-0" />
      <div
        class="absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-150 ease-out"
        :style="{ width: `${progress}%` }"
      >
        <!-- Full-width gradient inside a clipped box, so a given point on the
             track keeps its colour instead of the ramp squashing as it fills. -->
        <div class="to-race-500 h-full w-screen bg-gradient-to-r from-emerald-500" />
      </div>
      <span
        class="checkers text-ink-800 dark:text-ink-100 absolute inset-y-0 right-0 w-4 [--checker-size:0.25rem]"
      />
    </div>
  </header>
</template>
