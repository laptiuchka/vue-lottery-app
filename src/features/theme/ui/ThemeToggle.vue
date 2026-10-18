<script setup lang="ts">
import { useThemeStore } from '../model/theme.store'
import { AppButton } from '@/shared/ui'

const themeStore = useThemeStore()
</script>

<template>
  <AppButton
   :icon="themeStore.isDark ? 'pi pi-sun' : 'pi pi-moon'"
    severity="secondary"
    @click="themeStore.toggleTheme()"
  />
</template>