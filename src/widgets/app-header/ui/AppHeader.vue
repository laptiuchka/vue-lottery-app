<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { ThemeToggle } from '@/features/theme'
import { AppButton } from '@/shared/ui'

const router = useRouter()
const sessionStore = useSessionStore()
const { isAuthenticated } = storeToRefs(sessionStore)

const logout = () => {
  sessionStore.clearSession()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="navbar">
    <div class="container">
      <router-link to="/" class="logo">🎰 Lottery App</router-link>
      <nav class="nav-links">
        <router-link to="/">Головна</router-link>
        <router-link to="/about">Про нас</router-link>
        <router-link v-if="isAuthenticated" to="/users">Користувачі</router-link>
        
        <ThemeToggle />

        <router-link v-if="!isAuthenticated" to="/login">
          <AppButton label="Увійти" severity="success" />
        </router-link>
        <AppButton v-else label="Вийти" severity="danger" text @click="logout" />
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background-color: var(--surface-card, #2c3e50);
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--surface-border, #ccc);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b983;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  font-weight: 500;
  color: inherit;
  transition: color 0.3s;
}

.nav-links a.router-link-active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
}
</style>