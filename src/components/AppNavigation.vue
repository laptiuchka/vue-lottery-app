<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import BaseButton from './BaseButton.vue';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <nav class="nav-container">
    <div class="nav-links">
      <router-link to="/" class="nav-item">Home</router-link>
      <router-link to="/about" class="nav-item">About author</router-link>
      <router-link to="/users" class="nav-item">Users</router-link>
    </div>

    <div class="auth-section">
      <template v-if="authStore.isAuthenticated">
        <span class="user-greeting">Hi, {{ authStore.user?.username }}</span>
        <BaseButton variant="secondary" @click="handleLogout">Logout</BaseButton>
      </template>
      <template v-else>
        <router-link to="/login" class="nav-item login-btn">Login</router-link>
      </template>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.nav-container {
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;

  .nav-links {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 32px; /* збільшена відстань між пунктами */
  }

  .nav-item {
    text-decoration: none;
    color: #4b4556;
    font-weight: 500;
    font-size: 15px;
    padding: 8px 18px;
    border-radius: 8px;
    letter-spacing: 0.2px;
    transition: all 0.2s ease;

    &:hover {
      color: #906cd4;
      background-color: #f7f4fd;
    }

    &.router-link-active,
    &.router-link-exact-active {
      color: #7751be;
      font-weight: 600;
      border-bottom: 2px solid #906cd4;
      border-radius: 0;
    }
  }

  .auth-section {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 16px;

    .user-greeting {
      font-size: 14px;
      font-weight: 500;
      color: #4b4556;
    }

    .login-btn {
      background-color: #906cd4;
      color: #ffffff !important;
      border-radius: 6px;
      border-bottom: none !important;
      padding: 8px 18px;

      &:hover {
        background-color: #7751be;
      }
    }
  }
}
</style>