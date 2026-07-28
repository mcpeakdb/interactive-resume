import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Tracks which section id is currently under the sticky header.
 * Uses scroll position rather than IntersectionObserver so that short sections
 * at the bottom of the page still register as active.
 */
export function useScrollSpy(ids, offset = 120) {
  const active = ref(ids[0])

  function update() {
    const scroll = window.scrollY + offset
    const atBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 2

    if (atBottom) {
      active.value = ids[ids.length - 1]
      return
    }

    let current = ids[0]
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el && el.offsetTop <= scroll) current = id
    }
    active.value = current
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  })

  return { active }
}
