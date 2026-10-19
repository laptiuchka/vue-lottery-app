<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { AppTable, AppButton, AppInput } from '@/shared/ui'
import { UserFormModal } from '@/features/user-form'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

const store = useUsersStore()
const { users, total, isLoading, winners } = storeToRefs(store)
const { fetchUsers, pickNewWinner, removeWinner, clearWinners, removeUser } = store

const toast = useToast()
const confirm = useConfirm()

const isFormModalOpen = ref(false)
const selectedUser = ref<User | null>(null)
const searchQuery = ref('')

let searchTimeout: ReturnType<typeof setTimeout>

watch(searchQuery, (newQuery) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchUsers(newQuery)
  }, 300)
})

const columns = [
  { field: 'id', header: 'ID', sortable: true },
  { field: 'firstName', header: "Ім'я", sortable: true },
  { field: 'lastName', header: 'Прізвище', sortable: true },
  { field: 'email', header: 'Email', sortable: true },
  { field: 'age', header: 'Вік', sortable: true },
  { field: 'actions', header: 'Дії', sortable: false }
]

onMounted(() => {
  fetchUsers()
})

function handleCreate() {
  selectedUser.value = null
  isFormModalOpen.value = true
}

function handleEdit(user: User) {
  selectedUser.value = user
  isFormModalOpen.value = true
}

function handleDelete(user: User) {
  confirm.require({
    message: `Ви дійсно бажаєте видалити користувача ${user.firstName} ${user.lastName}?`,
    header: 'Підтвердження видалення',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Видалити',
    rejectLabel: 'Скасувати',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await removeUser(user.id)
        toast.add({
          severity: 'success',
          summary: 'Успіх',
          detail: 'Користувача успішно видалено',
          life: 3000
        })
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Помилка',
          detail: (e as Error).message,
          life: 3000
        })
      }
    }
  })
}

function handlePickWinner() {
  try {
    const winner = pickNewWinner()
    toast.add({
      severity: 'success',
      summary: 'Переможець!',
      detail: `Обрано переможця: ${winner.firstName} ${winner.lastName}`,
      life: 3000
    })
  } catch (e) {
    toast.add({
      severity: 'warn',
      summary: 'Увага',
      detail: (e as Error).message,
      life: 3000
    })
  }
}
</script>

<template>
  <div class="users-widget">
    <div class="header-actions">
      <h2>Список користувачів</h2>

      <div class="actions-bar">
        <div class="search-box">
          <AppInput
            v-model="searchQuery"
            placeholder="Пошук..."
          />
        </div>
        <div class="btns">
          <AppButton label="Додати користувача +" class="btn-add" @click="handleCreate" />
          <AppButton label="New Winner" class="btn-winner" @click="handlePickWinner" />
        </div>
      </div>
    </div>

    <div v-if="winners.length > 0" class="winners-section">
      <h3>Переможці ({{ winners.length }}/3):</h3>
      <div class="winners-tags">
        <span v-for="w in winners" :key="w.id" class="winner-badge">
         {{ w.firstName }} {{ w.lastName }}
          <button class="remove-btn" @click="removeWinner(w.id)">✕</button>
        </span>
        <button class="clear-btn" @click="clearWinners">Очистити</button>
      </div>
    </div>

    <div class="table-wrapper">
      <AppTable
        :value="users"
        :columns="columns"
        :loading="isLoading"
        :paginator="true"
        :rows="10"
        :total-records="total"
      >
        <template #actions="{ data }">
          <div class="row-actions">
            <AppButton
              icon="pi pi-pencil"
              severity="secondary"
              class="action-btn edit-btn"
              @click="handleEdit(data)"
            />
            <AppButton
              icon="pi pi-trash"
              severity="danger"
              class="action-btn delete-btn"
              @click="handleDelete(data)"
            />
          </div>
        </template>
      </AppTable>
    </div>

    <UserFormModal v-model:visible="isFormModalOpen" :user="selectedUser" />
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.users-widget {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.actions-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  width: 220px;
  display: flex;
  align-items: center;
}

:deep(.search-box input),
:deep(.search-box .p-inputtext) {
  width: 100%;
  height: 42px !important; 
  border-color: #8557be !important; 
  border-radius: 8px !important;
  background-color: transparent !important;
  color: inherit !important;
}

:deep(.search-box input:focus),
:deep(.search-box .p-inputtext:focus) {
  border-color: #9d68dc !important;
  box-shadow: 0 0 0 0.2rem rgba(133, 87, 190, 0.25) !important;
}

.btns {
  display: flex;
  align-items: center;
  gap: 1rem;
}

:deep(.btn-add),
:deep(.p-button:not(.p-button-danger):not(.p-button-secondary)) {
  background-color: #8557be !important;
  border-color: #8557be !important;
  color: #ffffff !important;
  border-radius: 8px !important;
  height: 42px !important;
}

:deep(.btn-add:hover),
:deep(.p-button:not(.p-button-danger):not(.p-button-secondary):hover) {
  background-color: #6b21a8 !important;
  border-color: #6b21a8 !important;
}

:deep(.btn-winner) {
  background-color: #4c1d95 !important;
  border-color: #4c1d95 !important;
  color: #ffffff !important;
  border-radius: 8px !important;
  height: 42px !important;
}

.row-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

:deep(.action-btn) {
  padding: 0.4rem 0.6rem !important;
  font-size: 0.85rem !important;
}

.winners-section {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 1.25rem;
  border-radius: 12px;
}

.winners-tags {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.winner-badge {
  background-color: #8557be;
  color: #ffffff;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-btn {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
}

.clear-btn {
  background-color: transparent;
  border: 1px solid currentColor;
  color: inherit;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
</style>