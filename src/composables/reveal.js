/**
 * v-reveal — fades/slides an element in the first time it scrolls into view.
 * `v-reveal="150"` delays the transition by 150ms for staggered groups.
 * `v-reveal.speed` swaps the upward drift for a lean in from the left.
 * Honors prefers-reduced-motion by revealing immediately.
 */
const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let observer = null

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  )
  return observer
}

export const reveal = {
  mounted(el, binding) {
    if (reduceMotion) {
      el.classList.add('is-revealed')
      return
    }
    el.classList.add(binding.modifiers.speed ? 'reveal-speed' : 'reveal')
    if (binding.value) el.style.transitionDelay = `${binding.value}ms`
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
