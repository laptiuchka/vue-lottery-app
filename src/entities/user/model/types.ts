export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  age?: number
  gender?: string
  phone?: string
}

export interface CreateUserDto {
  firstName: string
  lastName: string
  email: string
  age?: number
  gender?: string
  phone?: string
}

export type UpdateUserDto = Partial<CreateUserDto>