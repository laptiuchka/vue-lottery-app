import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref<boolean>(localStorage.getItem('theme') === 'dark')

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  watch(
    isDark,
    (val) => {
      if (val) {
        document.documentElement.classList.add('dark-theme')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark-theme')
        localStorage.setItem('theme', 'light')
      }
    },
    { immediate: true }
  )

  return { isDark, toggleTheme }
})