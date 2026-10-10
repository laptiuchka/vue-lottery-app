<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from './layouts/DefaultLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';

const route = useRoute();

const layout = computed(() => {
  return route.meta.layout === 'AuthLayout' ? AuthLayout : DefaultLayout;
});
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #ffffff;
  color: #333333;
}
</style>