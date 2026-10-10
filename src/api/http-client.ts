const BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com';

let isRefreshing = false;

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('access_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && !path.includes('/auth/login') && !path.includes('/auth/refresh')) {
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken && !isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refreshToken,
            expiresInMins: 30,
          }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          localStorage.setItem('access_token', refreshData.accessToken);
          localStorage.setItem('refresh_token', refreshData.refreshToken);
          headers['Authorization'] = `Bearer ${refreshData.accessToken}`;

          response = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers,
          });
        } else {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
        }
      } catch (err: unknown) {
        console.error('Refresh token error:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
      }
    }
  }

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errJson = await response.json();
      errorDetail = errJson.message || errorDetail;
    } catch (err: unknown) {
      errorDetail = response.statusText || String(err);
    }
    throw new Error(errorDetail || `HTTP error ${response.status}`);
  }

  return response.json() as Promise<T>;
}