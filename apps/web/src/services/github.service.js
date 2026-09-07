import { api } from './api';

export const githubService = {
  getAuthUrl: async () => {
    const res = await api.get('/github/auth-url');
    return res.data?.url;
  },

  handleCallback: async (code) => {
    const res = await api.post('/github/callback', { code });
    return res.data;
  },

  listRepositories: async () => {
    const res = await api.get('/github/repositories');
    return res.data;
  },

  importRepository: async (dto) => {
    const res = await api.post('/github/import', dto);
    return res.data;
  },
};
