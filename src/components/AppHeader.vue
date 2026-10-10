<script setup lang="ts">
import Logo from './Logo.vue';
import AppNavigation from './AppNavigation.vue';
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <Logo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background-color: #ffffff;
  border-bottom: 1px solid #ede8f5;
  padding: 12px 0;
  margin-bottom: 2rem;
  box-shadow: 0 1px 4px rgba(119, 81, 190, 0.05);

  .header-inner {
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    position: relative;
  }
}
</style>