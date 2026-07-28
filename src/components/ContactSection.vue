<script setup>
import { profile } from '../data/resume'
import AppIcon from './AppIcon.vue'
import SectionHeading from './SectionHeading.vue'
</script>

<template>
  <section id="contact" class="scroll-mt-24 pt-16 pb-24">
    <div class="section-shell">
      <SectionHeading index="04 — Say hello" title="Get in touch" />

      <div v-reveal class="card relative overflow-hidden p-6 sm:p-10">
        <div class="aurora pointer-events-none absolute inset-0 opacity-70" />

        <div class="relative">
          <p
            class="text-ink-700 dark:text-ink-200 max-w-xl text-lg leading-relaxed text-pretty"
          >
            Building something that needs a full-stack developer who has also run the
            infrastructure underneath it? I'd like to hear about it — LinkedIn is the
            best way to reach me.
          </p>

          <div class="mt-7 flex flex-wrap gap-3">
            <a
              :href="profile.linkedinUrl"
              target="_blank"
              rel="noreferrer"
              class="dark:bg-ink-50 dark:text-ink-950 bg-ink-900 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <AppIcon name="linkedin" :size="17" />
              Connect on LinkedIn
            </a>
          </div>

          <p class="text-ink-400 dark:text-ink-500 mt-8 text-xs">
            Contact details and references available on request.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
