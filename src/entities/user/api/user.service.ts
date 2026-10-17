import { HttpClient, type Readable, type Creatable, type Editable, type Deletable } from '@/shared/api'
import type { User, CreateUserDto, UpdateUserDto } from '../model/types'

export class UserService implements Readable<User>, Creatable<User, CreateUserDto>, Editable<User, UpdateUserDto>, Deletable {
  async getAll(params?: { limit?: number; skip?: number; q?: string }): Promise<{ users: User[]; total: number }> {
    const limit = params?.limit ?? 10
    const skip = params?.skip ?? 0
    
    if (params?.q) {
      return HttpClient.request<{ users: User[]; total: number }>(`/users/search?q=${encodeURIComponent(params.q)}&limit=${limit}&skip=${skip}`)
    }
    
    return HttpClient.request<{ users: User[]; total: number }>(`/users?limit=${limit}&skip=${skip}`)
  }

  async getById(id: number): Promise<User> {
    return HttpClient.request<User>(`/users/${id}`)
  }

  async create(data: CreateUserDto): Promise<User> {
    return HttpClient.request<User>('/users/add', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    return HttpClient.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete(id: number): Promise<boolean> {
    await HttpClient.request(`/users/${id}`, {
      method: 'DELETE',
    })
    return true
  }
}