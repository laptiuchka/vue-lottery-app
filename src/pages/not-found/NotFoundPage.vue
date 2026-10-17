<script setup lang="ts">
import { AppButton } from '@/shared/ui'
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Cторінку не знайдено</p>
    <router-link to="/">
      <AppButton label="На головну" />
    </router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 4rem 1rem;
}

.not-found h1 {
  font-size: 5rem;
  margin: 0;
}
</style>