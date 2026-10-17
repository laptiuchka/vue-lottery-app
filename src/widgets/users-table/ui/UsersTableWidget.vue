<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import Column from 'primevue/column'
import { useUsersStore, type User } from '@/entities/user'
import { UserFormModal } from '@/features/user-form'
import { AppButton, AppTable, AppConfirmDialog } from '@/shared/ui'

defineProps<{
  users: User[]
  loading?: boolean
}>()

const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const usersStore = useUsersStore()

const isModalVisible = ref(false)
const selectedUser = ref<User | null>(null)

const tableColumns = [
  { field: 'id', header: 'ID' },
  { field: 'firstName', header: "Ім'я" },
  { field: 'lastName', header: 'Прізвище' },
  { field: 'email', header: 'Email' },
]

const openCreateModal = () => {
  selectedUser.value = null
  isModalVisible.value = true
}

const openEditModal = (user: User) => {
  selectedUser.value = user
  isModalVisible.value = true
}

const viewDetails = (id: number) => {
  router.push(`/users/${id}`)
}

const confirmDelete = (user: User) => {
  confirm.require({
    message: `Ви дійсно бажаєте видалити користувача ${user.firstName} ${user.lastName}?`,
    header: 'Підтвердження видалення',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Так',
    rejectLabel: 'Ні',
    accept: async () => {
      try {
        await usersStore.removeUser(user.id)
        toast.add({ severity: 'success', summary: 'Видалено', detail: 'Користувача успішно видалено', life: 3000 })
      } catch (e) {
        toast.add({ severity: 'error', summary: 'Помилка', detail: (e as Error).message, life: 3000 })
      }
    },
  })
}
</script>

<template>
  <div class="users-widget">
    <div class="widget-header">
      <h3>Список користувачів</h3>
      <AppButton label="Додати користувача" icon="pi pi-plus" severity="success" @click="openCreateModal" />
    </div>

    <AppTable :value="users" :columns="tableColumns" :loading="loading">
      <Column header="Дії">
        <template #body="{ data }">
          <div class="actions">
            <AppButton icon="pi pi-eye" text severity="info" @click="viewDetails(data.id)" />
            <AppButton icon="pi pi-pencil" text severity="warn" @click="openEditModal(data)" />
            <AppButton icon="pi pi-trash" text severity="danger" @click="confirmDelete(data)" />
          </div>
        </template>
      </Column>
    </AppTable>

    <UserFormModal v-model:visible="isModalVisible" :user-to-edit="selectedUser" />
    <AppConfirmDialog />
  </div>
</template>

<style scoped>
.users-widget {
  background: var(--surface-card, #fff);
  padding: 1.5rem;
  border-radius: 8px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  gap: 0.25rem;
}
</style>