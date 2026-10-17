import { ServiceProvider } from '@/shared/api'
import { UserService } from '@/entities/user'

export function registerServices(): void {
  ServiceProvider.register('users', () => new UserService())
}