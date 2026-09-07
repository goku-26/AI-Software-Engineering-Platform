import { api } from './api';

export const authService = {
  login: async (dto) => {
    const res = await api.post('/auth/login', dto);
    if (res.data?.tokens?.accessToken) {
      localStorage.setItem('devforge_token', res.data.tokens.accessToken);
    }
    return res.data;
  },

  register: async (dto) => {
    const res = await api.post('/auth/register', dto);
    if (res.data?.tokens?.accessToken) {
      localStorage.setItem('devforge_token', res.data.tokens.accessToken);
    }
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('devforge_token');
  },
};
