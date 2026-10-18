<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { ThemeToggle } from '@/features/theme'
import { AppButton } from '@/shared/ui'

const router = useRouter()
const sessionStore = useSessionStore()
const { isAuthenticated } = storeToRefs(sessionStore)

function handleLogout() {
  sessionStore.clearSession()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <div class="logo-container" @click="router.push('/')">
      <img src="/logo.png" alt="Lottery App Logo" class="logo-img" />
      <span class="logo-text">Lottery App</span>
    </div>

    <nav class="nav-links">
      <router-link to="/">Головна</router-link>
      <router-link to="/about">Про нас</router-link>
      <router-link v-if="isAuthenticated" to="/users">Користувачі</router-link>
    </nav>

    <div class="actions">
      <ThemeToggle />
      <AppButton
        v-if="isAuthenticated"
        label="Вийти"
        severity="secondary"
        @click="handleLogout"
      />
      <router-link v-else to="/login">
        <AppButton label="Увійти" />
      </router-link>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #8557be !important; 
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(133, 87, 190, 0.3);
  margin-bottom: 2rem;
  border: 1px solid #9d68dc;
  transition: all 0.3s ease;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.logo-img {
  height: 40px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff !important;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #f3e8ff !important;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
}

.nav-links a.router-link-active {
  background-color: #ffffff !important;
  color: #6b21a8 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

:global(.dark-theme) .app-header {
  background-color: #1d1b20 !important;
  border-color: #8557be !important;
}
</style>