<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/entities/user'
import { UsersTableWidget } from '@/widgets/users-table'

const usersStore = useUsersStore()
const { users, isLoading } = storeToRefs(usersStore)

onMounted(() => {
  usersStore.fetchUsers()
})
</script>

<template>
  <div class="users-page">
    <UsersTableWidget :users="users" :loading="isLoading" />
  </div>
</template>