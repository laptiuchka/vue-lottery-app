import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AuthUser, LoginCredentials } from '../types/user';
import { ServiceProvider } from '../services/service-provider';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'));
  const user = ref<AuthUser | null>(
    localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user') as string) : null
  );
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials: LoginCredentials) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await ServiceProvider.auth.login(credentials);
      token.value = data.accessToken;
      user.value = data;

      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('auth_user', JSON.stringify(data));
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message || 'Login failed';
      } else {
        error.value = 'Login failed';
      }
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    error.value = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
  };

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
  };
});