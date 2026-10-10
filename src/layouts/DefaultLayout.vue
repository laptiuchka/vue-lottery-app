<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
</script>

<template>
  <div class="layout-default">
    <AppHeader />
    <main class="content-container">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.layout-default {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .content-container {
    max-width: 960px;
    width: 100%;
    margin: 0 auto;
    padding: 0 1rem 3rem 1rem;
    flex: 1;
  }
}
</style>