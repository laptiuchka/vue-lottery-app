<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/entities/user'
import { UsersTableWidget } from '@/widgets/users-table'

const usersStore = useUsersStore()
const { users, isLoading, total } = storeToRefs(usersStore)

onMounted(() => {
  if (users.value.length === 0) {
    usersStore.fetchUsers({ limit: 208 })
  }
})
</script>

<template>
  <div class="users-page">
    <UsersTableWidget :users="users" :total="total" :loading="isLoading" />
  </div>
</template>

<style scoped>
.users-page {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>