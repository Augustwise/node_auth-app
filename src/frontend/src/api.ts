const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const ACCESS_TOKEN_KEY = 'accessToken';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export type ApiError = {
  message: string;
  errors?: Record<string, string>;
};

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const token = getAccessToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw data as ApiError;
  }

  return data as T;
}

export function register(body: {
  name: string;
  email: string;
  password: string;
}) {
  return request<{ message: string }>('/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function login(body: { email: string; password: string }) {
  return request<{ accessToken: string }>('/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function fetchMe() {
  return request<{ id: number; name: string; email: string }>('/users/me');
}

export function changePassword(body: {
  oldPassword: string;
  newPassword: string;
}) {
  return request<{ message: string }>('/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function changeName(body: { newName: string }) {
  return request<{ message: string }>('/users/me/name', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
