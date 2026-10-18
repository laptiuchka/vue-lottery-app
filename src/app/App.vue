<script setup lang="ts">
import Toast from 'primevue/toast'
import { AppHeader } from '@/widgets/app-header'
</script>

<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <Toast />
  </div>
</template>

<style scoped>
.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>