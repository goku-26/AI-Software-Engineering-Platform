import { api } from './api';

export const projectService = {
  listProjects: async (search) => {
    const params = search ? { search } : {};
    const res = await api.get('/projects', { params });
    return res.data;
  },

  createProject: async (dto) => {
    const res = await api.post('/projects', dto);
    return res.data;
  },

  getProjectById: async (id) => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  updateProject: async (id, dto) => {
    const res = await api.put(`/projects/${id}`, dto);
    return res.data;
  },

  deleteProject: async (id) => {
    await api.delete(`/projects/${id}`);
  },
};
