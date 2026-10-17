export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  age?: number
  gender?: string
  phone?: string
  username?: string
  image?: string
  role?: string
}

export type CreateUserDto = Omit<User, 'id'>
export type UpdateUserDto = Partial<CreateUserDto>