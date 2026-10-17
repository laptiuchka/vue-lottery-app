import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { UserService } from '../api/user.service'
import type { User, CreateUserDto, UpdateUserDto } from './types'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasUsers = computed(() => users.value.length > 0)

  const service = () => ServiceProvider.get<UserService>('users')

  async function fetchUsers(params?: { limit?: number; skip?: number; q?: string }) {
    isLoading.value = true
    error.value = null
    try {
      const data = await service().getAll(params)
      users.value = data.users
      total.value = data.total
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUserById(id: number) {
    isLoading.value = true
    error.value = null
    try {
      currentUser.value = await service().getById(id)
      return currentUser.value
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(dto: CreateUserDto) {
    isLoading.value = true
    error.value = null
    try {
      const newUser = await service().create(dto)
      users.value = [newUser, ...users.value]
      total.value += 1
      return newUser
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateUser(id: number, dto: UpdateUserDto) {
    isLoading.value = true
    error.value = null
    try {
      const updated = await service().update(id, dto)
      users.value = users.value.map((u) => (u.id === id ? { ...u, ...updated } : u))
      if (currentUser.value?.id === id) {
        currentUser.value = { ...currentUser.value, ...updated }
      }
      return updated
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function removeUser(id: number) {
    isLoading.value = true
    error.value = null
    try {
      await service().delete(id)
      users.value = users.value.filter((u) => u.id !== id)
      total.value -= 1
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    currentUser,
    total,
    isLoading,
    error,
    hasUsers,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    removeUser,
  }
})