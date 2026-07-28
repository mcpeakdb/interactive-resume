import { ref, watch } from 'vue'

const isDark = ref(document.documentElement.classList.contains('dark'))

watch(isDark, (dark) => {
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
})

export function useTheme() {
  return { isDark, toggle: () => (isDark.value = !isDark.value) }
}
