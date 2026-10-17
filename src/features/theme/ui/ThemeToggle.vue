<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '../model/theme.store'
import { AppButton } from '@/shared/ui'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.applyTheme()
})
</script>

<template>
  <AppButton
    :icon="themeStore.isDark ? 'pi pi-sun' : 'pi pi-moon'"
    severity="secondary"
    text
    @click="themeStore.toggleTheme"
  />
</template>