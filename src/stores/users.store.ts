import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, CreateUserDto, UpdateUserDto } from '../types/user';
import { ServiceProvider } from '../services/service-provider';

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchUsers = async (params: { limit: number; skip: number; query?: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await ServiceProvider.users.getWithPagination(params);
      users.value = data.users;
      total.value = data.total;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Помилка завантаження користувачів';
      }
    } finally {
      loading.value = false;
    }
  };

  const getUserById = async (id: number): Promise<User> => {
    const localUser = users.value.find((u) => u.id === id);
    if (localUser) {
      return localUser;
    }
    return await ServiceProvider.users.getById(id);
  };

  const createUser = async (dto: CreateUserDto): Promise<User> => {
    const newUser = await ServiceProvider.users.create(dto);
    users.value.unshift(newUser);
    total.value += 1;
    return newUser;
  };

  const updateUser = async (id: number, dto: UpdateUserDto): Promise<User> => {
    let updated: User;
    try {
      updated = await ServiceProvider.users.update(id, dto);
    } catch {
      const existing = users.value.find((u) => u.id === id);
      updated = { ...(existing as User), ...dto } as User;
    }

    const index = users.value.findIndex((u) => u.id === id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updated };
    }
    return updated;
  };

  const deleteUser = async (id: number): Promise<void> => {
    try {
      await ServiceProvider.users.delete(id);
    } catch (err: unknown) {
      console.warn('Fake delete API error ignored:', err);
    }
    users.value = users.value.filter((u) => u.id !== id);
    total.value -= 1;
  };

  return {
    users,
    total,
    loading,
    error,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
});