<script setup>
import { profile } from '../data/resume'
import AppIcon from './AppIcon.vue'
import StatStrip from './StatStrip.vue'
</script>

<template>
  <section id="about" class="relative overflow-hidden pt-10 pb-16 sm:pt-16">
    <div class="aurora pointer-events-none absolute inset-x-0 -top-32 h-[36rem]" />
    <div
      class="speed-lines no-print text-ink-500 dark:text-ink-300 pointer-events-none absolute inset-x-0 -top-32 h-[36rem] opacity-60"
    />

    <div class="section-shell relative">
      <p
        v-reveal
        class="text-ink-500 dark:text-ink-400 mb-4 flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase"
      >
        <span class="relative flex h-2 w-2">
          <span
            class="no-print absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
          />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Green flag — open to conversations
      </p>

      <h1
        v-reveal.speed="60"
        class="text-ink-900 dark:text-ink-50 text-4xl font-bold tracking-tight text-balance sm:text-6xl"
      >
        {{ profile.name }}
      </h1>

      <!-- Flag stripe under the name, like a livery accent. -->
      <div v-reveal.speed="100" class="mt-4 flex items-center gap-3">
        <span
          class="checkers flag-wave text-ink-800 dark:text-ink-100 h-3 w-16 rounded-[2px] [--checker-size:0.75rem]"
          aria-hidden="true"
        />
        <span
          class="to-race-500/70 h-[3px] w-24 rounded-full bg-gradient-to-r from-emerald-500"
          aria-hidden="true"
        />
      </div>

      <p
        v-reveal.speed="140"
        class="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl dark:from-emerald-400 dark:to-teal-400"
      >
        {{ profile.title }}
      </p>

      <p
        v-reveal="180"
        class="text-ink-600 dark:text-ink-300 mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg"
      >
        {{ profile.summary }}
        Currently building at
        <span class="text-ink-900 dark:text-ink-50 font-medium">Capital One</span>.
      </p>

      <div v-reveal="240" class="mt-8 flex flex-wrap items-center gap-2.5">
        <a
          :href="profile.linkedinUrl"
          target="_blank"
          rel="noreferrer"
          class="text-ink-700 dark:text-ink-200 ring-ink-200 dark:ring-ink-800 hover:border-transparent hover:bg-ink-900 dark:hover:bg-ink-100 hover:text-white dark:hover:text-ink-950 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <AppIcon name="linkedin" :size="15" />
          {{ profile.linkedin }}
        </a>
      </div>

      <StatStrip v-reveal="300" class="mt-12" />
    </div>
  </section>
</template>
