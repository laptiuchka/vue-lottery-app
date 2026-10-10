import { http } from '../api/http-client';
import type { User, CreateUserDto, UpdateUserDto, UsersResponse } from '../types/user';
import type { Readable, Creatable, Editable, Deletable } from './interfaces';

export class UserService
  implements
    Readable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable
{
  async getAll(params: { limit?: number; skip?: number } = { limit: 10, skip: 0 }): Promise<User[]> {
    const limit = params.limit ?? 10;
    const skip = params.skip ?? 0;
    const data = await http<UsersResponse>(`/users?limit=${limit}&skip=${skip}`);
    return data.users;
  }

  async getWithPagination(params: { limit: number; skip: number; query?: string }): Promise<UsersResponse> {
    const { limit, skip, query } = params;
    if (query && query.trim() !== '') {
      return http<UsersResponse>(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
    }
    return http<UsersResponse>(`/users?limit=${limit}&skip=${skip}`);
  }

  async getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`);
  }

  async create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(id: number): Promise<void> {
    await http<User>(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}