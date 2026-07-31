<script setup>
import { skills, TAGS } from '../data/resume'
import { tagStyle } from '../data/tagStyles'
import { useFilters } from '../composables/useFilters'
import SectionHeading from './SectionHeading.vue'

const { isActive, toggle } = useFilters()

const styleFor = (tag) => tagStyle(TAGS[tag]?.color ?? 'slate')
</script>

<template>
  <section id="skills" class="scroll-mt-24 py-16">
    <div class="section-shell">
      <SectionHeading
        index="01 — Toolkit"
        title="Skills"
        subtitle="Grouped by discipline and color-coded to match the experience filters. Click any skill to jump the timeline to the work where it was used."
      />

      <div class="grid gap-4 sm:grid-cols-2">
        <div
          v-for="(group, i) in skills"
          :key="group.group"
          v-reveal="i * 70"
          class="card p-5"
        >
          <h3
            class="text-ink-400 dark:text-ink-500 mb-4 font-mono text-[0.7rem] tracking-[0.15em] uppercase"
          >
            {{ group.group }}
          </h3>
          <ul class="flex flex-wrap gap-2">
            <li v-for="skill in group.items" :key="skill.name">
              <button
                type="button"
                :aria-pressed="isActive(skill.tag)"
                class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium ring-1 transition duration-200 hover:-translate-y-px hover:shadow-sm"
                :class="
                  isActive(skill.tag)
                    ? styleFor(skill.tag).active
                    : styleFor(skill.tag).chip
                "
                @click="toggle(skill.tag)"
              >
                <span
                  v-if="!isActive(skill.tag)"
                  class="h-1.5 w-1.5 rounded-full"
                  :class="styleFor(skill.tag).dot"
                  aria-hidden="true"
                />
                {{ skill.name }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
