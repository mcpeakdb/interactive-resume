import { computed, ref, watch } from 'vue'

/**
 * Site-wide skin — the whole palette at once.
 *
 * A skin doesn't touch components. It re-declares the theme's custom properties
 * in style.css, so every utility that resolves a colour through them follows
 * along. Orthogonal to dark/light: each skin ships both halves of its ramp, so
 * the two switches compose rather than fight.
 *
 * Adding one means an entry here, a matching `html[data-skin='…']` block in
 * style.css, and the id in the pre-paint allowlist in index.html.
 */
export const SKINS = [
  { id: 'racing', label: 'Racing', icon: 'flag' },
  { id: 'boba', label: 'Boba', icon: 'boba' },
]

// index.html resolves the stored skin before first paint, so read it back off
// the element rather than localStorage — one source of truth for the first frame.
const stored = document.documentElement.dataset.skin
const skin = ref(SKINS.some((s) => s.id === stored) ? stored : SKINS[0].id)

watch(skin, (id) => {
  document.documentElement.dataset.skin = id
  localStorage.setItem('skin', id)
})

export function useSkin() {
  const index = computed(() =>
    Math.max(
      SKINS.findIndex((s) => s.id === skin.value),
      0,
    ),
  )
  const current = computed(() => SKINS[index.value])
  const next = computed(() => SKINS[(index.value + 1) % SKINS.length])

  // Cycles instead of opening a menu: with a short list that keeps the header
  // to a single control, and every skin is still one keystroke away.
  const cycle = () => (skin.value = next.value.id)

  return { skin, current, next, cycle }
}
