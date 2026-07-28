<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { profile, sections } from '../data/resume'
import { useScrollSpy } from '../composables/useScrollSpy'
import { useTheme } from '../composables/useTheme'
import AppIcon from './AppIcon.vue'

const { active } = useScrollSpy(sections.map((s) => s.id))
const { isDark, toggle } = useTheme()

const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 24)
const print = () => window.print()

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
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
        <button
          type="button"
          class="text-ink-500 dark:text-ink-400 hover:bg-ink-200/60 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-white grid h-9 w-9 place-items-center rounded-lg transition-colors duration-200"
          title="Print / save as PDF"
          aria-label="Print or save as PDF"
          @click="print"
        >
          <AppIcon name="printer" :size="18" />
        </button>
        <button
          type="button"
          class="text-ink-500 dark:text-ink-400 hover:bg-ink-200/60 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-white grid h-9 w-9 place-items-center rounded-lg transition-colors duration-200"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggle"
        >
          <AppIcon :name="isDark ? 'sun' : 'moon'" :size="18" />
        </button>
      </div>
    </div>
  </header>
</template>
