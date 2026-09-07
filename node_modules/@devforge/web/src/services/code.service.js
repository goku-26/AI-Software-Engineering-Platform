import { api } from './api';

export const codeService = {
  getFileTree: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/files`);
    return res.data;
  },

  getFileContent: async (projectId, filePath) => {
    const res = await api.get(`/projects/${projectId}/files/content`, {
      params: { path: filePath },
    });
    return res.data;
  },

  saveFileContent: async (projectId, filePath, content) => {
    const res = await api.post(`/projects/${projectId}/files`, {
      path: filePath,
      content,
    });
    return res.data;
  },

  searchCode: async (projectId, query) => {
    const res = await api.get(`/projects/${projectId}/search`, {
      params: { q: query },
    });
    return res.data;
  },
};
