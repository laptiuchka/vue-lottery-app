import { http } from '../api/http-client';
import type { AuthUser, LoginCredentials, User } from '../types/user';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    return http<AuthUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(): Promise<User> {
    return http<User>('/auth/me');
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    return http<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
    });
  }
}