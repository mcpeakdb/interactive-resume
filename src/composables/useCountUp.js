import { onBeforeUnmount, ref } from 'vue'

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Animates 0 → target with an ease-out curve once `start()` is called. */
export function useCountUp(target, duration = 1400) {
  const value = ref(reduceMotion ? target : 0)
  let frame = null
  let started = false

  function start() {
    if (started || reduceMotion) return
    started = true
    const begin = performance.now()

    const step = (now) => {
      const t = Math.min((now - begin) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      value.value = Math.round(target * eased)
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
  }

  onBeforeUnmount(() => frame && cancelAnimationFrame(frame))

  return { value, start }
}
