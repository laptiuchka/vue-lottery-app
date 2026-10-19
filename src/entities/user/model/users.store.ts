import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { UserService } from '../api/user.service'
import type { User, CreateUserDto, UpdateUserDto } from './types'

const LOCAL_STORAGE_USERS_KEY = 'vue_lottery_app_custom_users'
const LOCAL_STORAGE_EDITED_KEY = 'vue_lottery_app_edited_users'
const LOCAL_STORAGE_DELETED_KEY = 'vue_lottery_app_deleted_users'
const LOCAL_STORAGE_WINNERS_KEY = 'vue_lottery_winners'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const winners = ref<User[]>(JSON.parse(localStorage.getItem(LOCAL_STORAGE_WINNERS_KEY) || '[]'))

  const hasUsers = computed(() => users.value.length > 0)
  const service = () => ServiceProvider.get<UserService>('users')

  function getCustomUsers(): User[] {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]')
    } catch {
      return []
    }
  }

  function saveCustomUsers(customUsers: User[]) {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(customUsers))
  }

  function getEditedUsers(): Record<number, Partial<User>> {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_EDITED_KEY) || '{}')
    } catch {
      return {}
    }
  }

  function saveEditedUsers(edited: Record<number, Partial<User>>) {
    localStorage.setItem(LOCAL_STORAGE_EDITED_KEY, JSON.stringify(edited))
  }

  function getDeletedUserIds(): number[] {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_DELETED_KEY) || '[]')
    } catch {
      return []
    }
  }

  function saveDeletedUserIds(ids: number[]) {
    localStorage.setItem(LOCAL_STORAGE_DELETED_KEY, JSON.stringify(ids))
  }

  async function fetchUsers(searchQuery = '') {
    isLoading.value = true
    error.value = null
    try {
      const data = await service().getAll({
        limit: 208,
        skip: 0,
        q: searchQuery.trim() || undefined
      })

      const customUsers = getCustomUsers()
      const editedUsers = getEditedUsers()
      const deletedIds = getDeletedUserIds()

      const query = searchQuery.toLowerCase().trim()
      const filteredCustomUsers = customUsers.filter((u) => {
        if (!query) return true
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase()
        return fullName.includes(query) || u.email.toLowerCase().includes(query)
      })

      const apiUsers = (data.users || []).map((u) => {
        const numericId = Number(u.id)
        if (editedUsers[numericId]) {
          return { ...u, ...editedUsers[numericId] }
        }
        return u
      })

      const combinedUsers = [...filteredCustomUsers, ...apiUsers].filter(
        (u) => !deletedIds.includes(Number(u.id))
      )

      users.value = combinedUsers
      total.value = combinedUsers.length
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

 async function createUser(dto: CreateUserDto) {
    isLoading.value = true
    try {
      await service().create(dto).catch(() => ({} as User))
      const customUsers = getCustomUsers()

      const newCustomUser: User = {
        id: Date.now(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        age: Number(dto.age),
        gender: dto.gender || 'female',
        phone: dto.phone || ''
      }

      customUsers.unshift(newCustomUser)
      saveCustomUsers(customUsers)

      users.value = [newCustomUser, ...users.value]
      total.value += 1
      return newCustomUser
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateUser(id: number, dto: UpdateUserDto) {
    isLoading.value = true
    try {
      await service().update(id, dto).catch(() => {})

      const numericId = Number(id)

      const customUsers = getCustomUsers()
      const customIndex = customUsers.findIndex((u) => Number(u.id) === numericId)
      if (customIndex !== -1) {
        customUsers[customIndex] = { ...customUsers[customIndex], ...dto }
        saveCustomUsers(customUsers)
      } else {
        const edited = getEditedUsers()
        edited[numericId] = { ...(edited[numericId] || {}), ...dto }
        saveEditedUsers(edited)
      }

      users.value = users.value.map((user) => {
        if (Number(user.id) === numericId) {
          return { ...user, ...dto }
        }
        return user
      })
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function removeUser(id: number) {
    isLoading.value = true
    try {
      await service().delete(id).catch(() => {})

      const numericId = Number(id)

      const customUsers = getCustomUsers().filter((u) => Number(u.id) !== numericId)
      saveCustomUsers(customUsers)

      const deletedIds = getDeletedUserIds()
      if (!deletedIds.includes(numericId)) {
        deletedIds.push(numericId)
        saveDeletedUserIds(deletedIds)
      }

      users.value = users.value.filter((u) => Number(u.id) !== numericId)
      total.value = Math.max(0, total.value - 1)
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function pickNewWinner() {
    if (winners.value.length >= 3) {
      throw new Error('Можна обрати максимум 3 переможців')
    }
    if (users.value.length === 0) {
      throw new Error('Немає користувачів для вибору')
    }

    const availableUsers = users.value.filter(
      (u) => !winners.value.some((w) => Number(w.id) === Number(u.id))
    )

    if (availableUsers.length === 0) {
      throw new Error('Усі користувачі вже є переможцями')
    }

    const randomIndex = Math.floor(Math.random() * availableUsers.length)
    const newWinner = availableUsers[randomIndex]

    winners.value.push(newWinner)
    localStorage.setItem(LOCAL_STORAGE_WINNERS_KEY, JSON.stringify(winners.value))
    return newWinner
  }

  function removeWinner(id: number) {
    winners.value = winners.value.filter((w) => Number(w.id) !== Number(id))
    localStorage.setItem(LOCAL_STORAGE_WINNERS_KEY, JSON.stringify(winners.value))
  }

  function clearWinners() {
    winners.value = []
    localStorage.removeItem(LOCAL_STORAGE_WINNERS_KEY)
  }

  return {
    users,
    total,
    isLoading,
    error,
    winners,
    hasUsers,
    fetchUsers,
    createUser,
    updateUser,
    removeUser,
    pickNewWinner,
    removeWinner,
    clearWinners
  }
})