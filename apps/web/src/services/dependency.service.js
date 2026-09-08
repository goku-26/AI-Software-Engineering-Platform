import { api } from './api';

export const dependencyService = {
  getGraph: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/dependencies/graph`);
    return res.data;
  },

  analyzeImpact: async (projectId, { symbolName }) => {
    const res = await api.post(`/projects/${projectId}/dependencies/impact-analysis`, {
      symbolName,
    });
    return res.data;
  },

  refactor: async (projectId, { dependencyId, targetVersion }) => {
    const res = await api.post(`/projects/${projectId}/dependencies/refactor`, {
      dependencyId,
      targetVersion,
    });
    return res.data;
  },
};
