<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '../types/user';
import { useUsersStore } from '../stores/users.store';
import BaseButton from '../components/BaseButton.vue';

const props = defineProps<{
  id: string | number;
}>();

const router = useRouter();
const usersStore = useUsersStore();
const user = ref<User | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    user.value = await usersStore.getUserById(Number(props.id));
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = 'Не вдалося завантажити дані користувача';
    }
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="user-details-card">
    <div v-if="loading" class="text-center">Завантаження інформації...</div>
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <div v-else-if="user" class="details-body">
      <div class="user-avatar" v-if="user.image">
        <img :src="user.image" :alt="user.firstName" />
      </div>

      <div class="user-info">
        <h2>{{ user.firstName }} {{ user.lastName }}</h2>
        <p><strong>Username:</strong> @{{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Телефон:</strong> {{ user.phone }}</p>
        <p><strong>Вік:</strong> {{ user.age }}</p>
        <p><strong>Стать:</strong> {{ user.gender }}</p>
        <p v-if="user.birthDate"><strong>Дата народження:</strong> {{ user.birthDate }}</p>
      </div>

      <div class="actions">
        <BaseButton variant="secondary" @click="router.push('/users')">Назад до списку</BaseButton>
        <router-link :to="`/users/${user.id}/edit`">
          <BaseButton variant="primary">Редагувати</BaseButton>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-details-card {
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #ede8f5;
  border-radius: 12px;
  padding: 2rem;

  .details-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .user-avatar img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid #906cd4;
    background-color: #fbf9fe;
  }

  .user-info {
    width: 100%;

    h2 {
      margin-top: 0;
      color: #7751be;
      border-bottom: 1px solid #ede8f5;
      padding-bottom: 0.5rem;
      text-align: center;
    }

    p {
      margin: 8px 0;
      font-size: 15px;
      color: #4b4556;
    }
  }

  .actions {
    display: flex;
    gap: 1rem;
    width: 100%;
    justify-content: flex-end;
  }

  .error-msg {
    color: #c62828;
    text-align: center;
  }
}
</style>