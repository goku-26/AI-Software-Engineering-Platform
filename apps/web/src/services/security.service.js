import { api } from './api';

export const securityService = {
  runScan: async (projectId) => {
    const res = await api.post(`/projects/${projectId}/security/scan`);
    return res.data;
  },

  getHistory: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/security/history`);
    return res.data;
  },

  remediate: async (projectId, { vulnerabilityId, filePath }) => {
    const res = await api.post(`/projects/${projectId}/security/remediate`, {
      vulnerabilityId,
      filePath,
    });
    return res.data;
  },

  applyRemediation: async (projectId, { vulnerabilityId }) => {
    const res = await api.post(`/projects/${projectId}/security/apply-remediation`, {
      vulnerabilityId,
    });
    return res.data;
  },
};
