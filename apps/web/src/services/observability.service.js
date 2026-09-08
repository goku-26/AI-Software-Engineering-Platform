import { api } from './api';

export const observabilityService = {
  getReport: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/observability/report`);
    return res.data;
  },

  getLogs: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/observability/logs`);
    return res.data;
  },

  runBenchmark: async (projectId) => {
    const res = await api.post(`/projects/${projectId}/observability/benchmark`);
    return res.data;
  },
};
