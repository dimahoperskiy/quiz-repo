import { config } from '@/config';

type MeResponse = {
  id: string;
  email: string;
};

type TokenResponse = {
  token: string;
};

type ErrorResponse = {
  error: string;
};

type RegisterResponse = {
  message: string;
};

export const getMe = async (): Promise<MeResponse | null> => {
  const token = localStorage.getItem('quiz-token');
  if (!token) return null;

  const res = await fetch(`${config.authServiceUrl}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const resJson = (await res.json()) as MeResponse;
  return res.ok ? resJson : null;
};

export const login = async (
  email: string,
  password: string,
): Promise<TokenResponse | ErrorResponse> => {
  const res = await fetch(`${config.authServiceUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const resJson = (await res.json()) as TokenResponse | ErrorResponse;

  if (res.ok && 'token' in resJson) {
    localStorage.setItem('quiz-token', resJson.token);
  }

  return resJson;
};

export const register = async (
  email: string,
  password: string,
): Promise<RegisterResponse | ErrorResponse> => {
  const res = await fetch(`${config.authServiceUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return (await res.json()) as RegisterResponse | ErrorResponse;
};

export const logout = () => {
  localStorage.removeItem('quiz-token');
  window.location.href = '/';
};
