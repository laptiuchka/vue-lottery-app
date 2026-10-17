<template>
  <div id="app">
    <header class="navbar">
      <div class="container">
        <router-link to="/" class="logo">🎰 Lottery App</router-link>
        <nav class="nav-links">
          <router-link to="/">Головна</router-link>
          <router-link to="/about">Про нас</router-link>
          <router-link to="/users">Користувачі</router-link>
          <router-link v-if="!isAuth" to="/login" class="btn-login">Увійти</router-link>
          <button v-else @click="logout" class="btn-logout">Вийти</button>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isAuth = ref(false)

const checkAuth = () => {
  isAuth.value = localStorage.getItem('isAuthenticated') === 'true'
}

onMounted(() => {
  checkAuth()
})

watch(() => route.path, () => {
  checkAuth()
})

const logout = () => {
  localStorage.removeItem('isAuthenticated')
  isAuth.value = false
  router.push({ name: 'login' })
}
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  padding: 1rem 2rem;
  color: white;
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
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a.router-link-active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
}

.btn-login, .btn-logout {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-login {
  background-color: #42b983;
  color: white !important;
}

.btn-logout {
  background-color: #e74c3c;
  color: white;
  border: none;
  font-weight: 500;
}

.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>