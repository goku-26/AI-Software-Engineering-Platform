import { api } from './api';

export const agentService = {
  executeTask: async (projectId, { prompt, role, targetFiles }) => {
    const res = await api.post(`/projects/${projectId}/agent/execute`, {
      prompt,
      role,
      targetFiles,
    });
    return res.data;
  },

  getProjectTasks: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/agent/tasks`);
    return res.data;
  },

  getTaskById: async (projectId, taskId) => {
    const res = await api.get(`/projects/${projectId}/agent/tasks/${taskId}`);
    return res.data;
  },

  applyPatch: async (projectId, taskId) => {
    const res = await api.post(`/projects/${projectId}/agent/tasks/${taskId}/apply`);
    return res.data;
  },
};
