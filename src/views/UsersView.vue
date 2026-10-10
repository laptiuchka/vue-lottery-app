<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { User, CreateUserDto } from '../types/user';
import type { Participant } from '../types/participant';
import { useUsersStore } from '../stores/users.store';
import WinnerBlock from '../components/WinnerBlock.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseModal from '../components/BaseModal.vue';

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();

const limit = 10;
const currentPage = ref(Number(route.query.page) || 1);
const searchQuery = ref(String(route.query.q || ''));

const winners = ref<Participant[]>([]);
const canPickWinner = computed(() => {
  if (winners.value.length >= 3) return false;
  return usersStore.users.some((u) => !winners.value.some((w) => w.id === String(u.id)));
});

const handlePickWinner = () => {
  if (!canPickWinner.value) return;
  const available = usersStore.users.filter(
    (u) => !winners.value.some((w) => w.id === String(u.id))
  );
  if (available.length > 0) {
    const randomUser = available[Math.floor(Math.random() * available.length)];
    winners.value.push({
      id: String(randomUser.id),
      name: `${randomUser.firstName} ${randomUser.lastName}`,
      dateOfBirth: randomUser.birthDate || '',
      email: randomUser.email,
      phone: randomUser.phone,
    });
  }
};

const handleRemoveWinner = (id: string) => {
  winners.value = winners.value.filter((w) => w.id !== id);
};

const loadUsers = async () => {
  const skip = (currentPage.value - 1) * limit;
  await usersStore.fetchUsers({
    limit,
    skip,
    query: searchQuery.value,
  });
};

const updateQueryParams = () => {
  router.push({
    query: {
      page: currentPage.value > 1 ? currentPage.value : undefined,
      q: searchQuery.value ? searchQuery.value : undefined,
    },
  });
};

const onSearchInput = (e: Event) => {
  searchQuery.value = (e.target as HTMLInputElement).value;
  currentPage.value = 1;
  updateQueryParams();
};

const changePage = (page: number) => {
  currentPage.value = page;
  updateQueryParams();
};

const totalPages = computed(() => Math.ceil(usersStore.total / limit) || 1);

watch(
  () => route.query,
  () => {
    currentPage.value = Number(route.query.page) || 1;
    searchQuery.value = String(route.query.q || '');
    loadUsers();
  }
);

onMounted(() => {
  loadUsers();
});

const isDeleteModalOpen = ref(false);
const userToDelete = ref<User | null>(null);

const openDeleteModal = (user: User) => {
  userToDelete.value = user;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (userToDelete.value) {
    await usersStore.deleteUser(userToDelete.value.id);
    winners.value = winners.value.filter((w) => w.id !== String(userToDelete.value!.id));
  }
  isDeleteModalOpen.value = false;
  userToDelete.value = null;
};

const isCreateModalOpen = ref(false);
const createForm = ref<CreateUserDto>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  username: '',
  age: 18,
  gender: 'female',
});

const createErrors = reactive<Record<string, string>>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  username: '',
  age: '',
});

const validateCreate = (): boolean => {
  let valid = true;
  createErrors.firstName = '';
  createErrors.lastName = '';
  createErrors.email = '';
  createErrors.phone = '';
  createErrors.username = '';
  createErrors.age = '';

  if (!createForm.value.firstName.trim()) {
    createErrors.firstName = "Ім'я є обов'язковим";
    valid = false;
  }
  if (!createForm.value.lastName.trim()) {
    createErrors.lastName = "Прізвище є обов'язковим";
    valid = false;
  }
  if (!createForm.value.email.trim()) {
    createErrors.email = "Email є обов'язковим";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.value.email)) {
    createErrors.email = 'Некоректний формат email';
    valid = false;
  }
  if (!createForm.value.phone.trim()) {
    createErrors.phone = "Телефон є обов'язковим";
    valid = false;
  }
  if (!createForm.value.username.trim()) {
    createErrors.username = "Username є обов'язковим";
    valid = false;
  }
  if (!createForm.value.age || createForm.value.age < 18) {
    createErrors.age = 'Учаснику має бути не менше 18 років';
    valid = false;
  } else if (createForm.value.age > 120) {
    createErrors.age = 'Введіть коректний вік';
    valid = false;
  }

  return valid;
};

const handleCreateUser = async () => {
  if (!validateCreate()) return;

  try {
    await usersStore.createUser(createForm.value);
    isCreateModalOpen.value = false;
    createForm.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      username: '',
      age: 18,
      gender: 'female',
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(`Помилка створення: ${err.message}`);
    }
  }
};
</script>

<template>
  <div class="users-view">
    <router-view />

    <WinnerBlock
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @pick-winner="handlePickWinner"
      @remove-winner="handleRemoveWinner"
    />

    <div class="controls-bar">
      <input
        type="text"
        :value="searchQuery"
        placeholder="Пошук за іменем..."
        class="search-field"
        @input="onSearchInput"
      />
      <BaseButton variant="primary" @click="isCreateModalOpen = true">
        + Додати користувача
      </BaseButton>
    </div>

    <div v-if="usersStore.loading" class="loader">Завантаження користувачів...</div>

    <div v-else-if="usersStore.error" class="error-banner">
      {{ usersStore.error }}
    </div>

    <div v-else class="card-custom table-card">
      <div class="table-responsive">
        <table class="table custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ім'я</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Вік</th>
              <th>Стать</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="usersStore.users.length === 0">
              <td colspan="7" class="text-center empty-msg">Користувачів не знайдено</td>
            </tr>
            <tr v-for="user in usersStore.users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>
                <router-link :to="`/users/${user.id}`" class="user-link">
                  {{ user.firstName }} {{ user.lastName }}
                </router-link>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.age }}</td>
              <td>{{ user.gender }}</td>
              <td class="actions-cell">
                <router-link :to="`/users/${user.id}/edit`">
                  <BaseButton variant="secondary">Редагувати</BaseButton>
                </router-link>
                <BaseButton variant="danger" @click="openDeleteModal(user)">
                  Видалити
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="pagination-bar">
        <BaseButton
          variant="secondary"
          :disabled="currentPage <= 1"
          @click="changePage(currentPage - 1)"
        >
          Назад
        </BaseButton>
        <span class="page-indicator">
          Сторінка {{ currentPage }} з {{ totalPages }}
        </span>
        <BaseButton
          variant="secondary"
          :disabled="currentPage >= totalPages"
          @click="changePage(currentPage + 1)"
        >
          Вперед
        </BaseButton>
      </div>
    </div>

    <BaseModal
      :is-open="isDeleteModalOpen"
      title="Підтвердження видалення"
      @close="isDeleteModalOpen = false"
    >
      <p v-if="userToDelete">
        Ви дійсно бажаєте видалити користувача "{{ userToDelete.firstName }} {{ userToDelete.lastName }}"?
      </p>
      <template #footer>
        <BaseButton variant="secondary" @click="isDeleteModalOpen = false">Ні</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      :is-open="isCreateModalOpen"
      title="Додати нового користувача"
      @close="isCreateModalOpen = false"
    >
      <form @submit.prevent="handleCreateUser">
        <BaseInput v-model="createForm.firstName" label="Ім'я" :error-message="createErrors.firstName" />
        <BaseInput v-model="createForm.lastName" label="Прізвище" :error-message="createErrors.lastName" />
        <BaseInput v-model="createForm.email" type="email" label="Email" :error-message="createErrors.email" />
        <BaseInput v-model="createForm.phone" label="Телефон" :error-message="createErrors.phone" />
        <BaseInput v-model="createForm.username" label="Username" :error-message="createErrors.username" />
        <BaseInput v-model.number="createForm.age" type="number" label="Вік" :error-message="createErrors.age" />
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="isCreateModalOpen = false">Скасувати</BaseButton>
        <BaseButton variant="primary" @click="handleCreateUser">Створити</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped lang="scss">
.users-view {
  .controls-bar {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .search-field {
      flex: 1;
      max-width: 400px;
      padding: 8px 12px;
      background-color: #fbf9fe;
      border: 1px solid #e3deee;
      border-radius: 6px;
      font-size: 14px;
      outline: none;

      &:focus {
        border-color: #906cd4;
        background-color: #ffffff;
      }
    }
  }

  .loader,
  .error-banner {
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
  }

  .error-banner {
    color: #c62828;
  }

  .table-card {
    border: 1px solid #ede8f5;
    background: #fff;
    border-radius: 8px;
  }

  .custom-table {
    width: 100%;
    margin-bottom: 0;

    th {
      background-color: #fbf9fe;
      color: #4b4556;
      font-size: 13px;
      padding: 12px 10px;
      border-bottom: 1px solid #ede8f5;
    }

    td {
      font-size: 13px;
      padding: 10px;
      vertical-align: middle;
      border-bottom: 1px solid #f6f3fa;
    }

    .user-link {
      color: #7751be;
      font-weight: 600;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
        color: #906cd4;
      }
    }
  }

  .actions-cell {
    display: flex;
    gap: 8px;
  }

  .empty-msg {
    color: #888;
    padding: 2rem;
  }

  .pagination-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-top: 1px solid #ede8f5;

    .page-indicator {
      font-size: 14px;
      font-weight: 500;
      color: #555;
    }
  }
}
</style>