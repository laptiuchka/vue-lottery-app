<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Card from 'primevue/card'
import { useUsersStore } from '@/entities/user'
import { AppButton } from '@/shared/ui'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const { currentUser, isLoading } = storeToRefs(usersStore)

onMounted(() => {
  const userId = Number(route.params.id)
  if (userId) {
    usersStore.fetchUserById(userId)
  }
})
</script>

<template>
  <div class="details-page">
    <AppButton label="Назад" icon="pi pi-arrow-left" text @click="router.back()" />

    <Card v-if="currentUser && !isLoading" class="user-card">
      <template #title>
        {{ currentUser.firstName }} {{ currentUser.lastName }}
      </template>
      <template #subtitle>
        ID: {{ currentUser.id }} | Role: {{ currentUser.role || 'User' }}
      </template>
      <template #content>
        <p><strong>Email:</strong> {{ currentUser.email }}</p>
        <p v-if="currentUser.phone"><strong>Телефон:</strong> {{ currentUser.phone }}</p>
        <p v-if="currentUser.username"><strong>Username:</strong> {{ currentUser.username }}</p>
      </template>
    </Card>

    <div v-else-if="isLoading">Завантаження даних...</div>
  </div>
</template>

<style scoped>
.details-page {
  padding: 1rem;
}

.user-card {
  max-width: 500px;
  margin-top: 1rem;
}
</style>