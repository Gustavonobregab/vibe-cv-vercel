export interface User {
  id: number
  email: string
  name: string
  password: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserDto {
  email: string
  name: string
  password: string
}

export interface UpdateUserDto {
  name?: string
}
