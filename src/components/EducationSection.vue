<script setup>
import { certifications, education } from '../data/resume'
import AppIcon from './AppIcon.vue'
import SectionHeading from './SectionHeading.vue'
</script>

<template>
  <section id="education" class="scroll-mt-24 py-16">
    <div class="section-shell">
      <SectionHeading index="03 — Foundations" title="Education & Certifications" />

      <div class="grid gap-4 lg:grid-cols-3">
        <div
          v-for="(school, i) in education"
          :key="school.school"
          v-reveal="i * 80"
          class="card hover:ring-ink-300 dark:hover:ring-ink-700 p-5 transition duration-300 hover:-translate-y-1"
        >
          <AppIcon name="cap" :size="22" class="mb-3 text-emerald-500" />
          <h3 class="text-ink-900 dark:text-ink-50 font-semibold">
            {{ school.school }}
          </h3>
          <p class="text-ink-600 dark:text-ink-300 mt-1.5 text-sm">
            {{ school.credential }}
          </p>
          <p class="text-ink-400 dark:text-ink-500 mt-2 text-xs tabular-nums">
            {{ school.location }} · {{ school.period }}
          </p>
        </div>

        <div
          v-for="(cert, i) in certifications"
          :key="cert.name"
          v-reveal="(education.length + i) * 80"
          class="card p-5 transition duration-300 hover:-translate-y-1"
          :class="
            cert.featured
              ? 'ring-2 ring-amber-500/40 hover:ring-amber-500/70'
              : 'hover:ring-ink-300 dark:hover:ring-ink-700'
          "
        >
          <div class="mb-3 flex items-center justify-between gap-2">
            <AppIcon
              name="badge"
              :size="22"
              :class="cert.featured ? 'text-amber-500' : 'text-teal-500'"
            />
            <span
              v-if="cert.featured"
              class="rounded-full bg-amber-500/10 px-2 py-0.5 text-[0.7rem] font-semibold text-amber-700 ring-1 ring-amber-500/25 dark:text-amber-300"
            >
              New
            </span>
          </div>
          <h3 class="text-ink-900 dark:text-ink-50 font-semibold text-balance">
            {{ cert.name }}
          </h3>
          <p
            v-if="cert.code"
            class="text-ink-500 dark:text-ink-400 mt-1.5 font-mono text-xs"
          >
            {{ cert.code }}
          </p>
          <p class="text-ink-400 dark:text-ink-500 mt-2 text-xs">{{ cert.date }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
