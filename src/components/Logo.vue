<script setup lang="ts">
import logoImg from '../assets/logo.png';
</script>

<template>
  <div class="brand-logo">
    <img :src="logoImg" alt="Lottery Logo" class="logo-image" />
    <span class="logo-text">LotteryApp</span>
  </div>
</template>

<style scoped lang="scss">
.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.3px;
  color: #7751be;
  user-select: none;

  .logo-image {
    height: 32px;
    width: auto;
    object-fit: contain;
    display: block;
  }

  .logo-text {
    color: #7751be;
  }
}
</style>