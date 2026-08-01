<script setup>
import BackToTop from './components/BackToTop.vue'
import ContactSection from './components/ContactSection.vue'
import EducationSection from './components/EducationSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import HeroSection from './components/HeroSection.vue'
import SiteHeader from './components/SiteHeader.vue'
import SkillsSection from './components/SkillsSection.vue'
</script>

<template>
  <a
    href="#about"
    class="no-print focus:bg-ink-900 sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:px-4 focus:py-2 focus:text-white"
  >
    Skip to content
  </a>

  <SiteHeader />

  <main>
    <HeroSection />
    <SkillsSection />
    <ExperienceSection />
    <EducationSection />
    <ContactSection />
  </main>

  <footer class="no-print">
    <!-- Crossing the line — full-width checker to close the page out. -->
    <div
      class="checkers checker-band text-ink-300 dark:text-ink-700 [--checker-size:0.75rem]"
      aria-hidden="true"
    />
    <div
      class="section-shell text-ink-500 dark:text-ink-400 flex flex-wrap items-center justify-between gap-2 py-6 text-xs"
    >
      <p>© {{ new Date().getFullYear() }} Danny McPeak Jr.</p>
      <p class="font-mono">Built with Vue 3 + Tailwind CSS</p>
    </div>
  </footer>

  <BackToTop />
</template>
