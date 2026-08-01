import { ref, watch } from 'vue'

/**
 * Hold-still switch for the looping racing animations.
 *
 * WCAG 2.2.2 (Level A) wants a way to pause anything that moves automatically
 * for more than five seconds. `prefers-reduced-motion` covers people who set it
 * at the OS level; this covers everyone else, and persists the choice.
 *
 * Scope is deliberately the infinite loops only — the reveal and count-up
 * animations are one-shot and well under five seconds.
 */
const isStill = ref(document.documentElement.classList.contains('motion-still'))

watch(isStill, (still) => {
  document.documentElement.classList.toggle('motion-still', still)
  localStorage.setItem('motion', still ? 'still' : 'moving')
})

export function useMotion() {
  return { isStill, toggle: () => (isStill.value = !isStill.value) }
}
