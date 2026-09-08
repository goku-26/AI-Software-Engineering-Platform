import { api } from './api';

export const infrastructureService = {
  getTopology: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/infrastructure/topology`);
    return res.data;
  },

  triggerDockerBuild: async (projectId, { repository, tag }) => {
    const res = await api.post(`/projects/${projectId}/infrastructure/build`, {
      repository,
      tag,
    });
    return res.data;
  },

  scaleService: async (projectId, { containerId, targetReplicas }) => {
    const res = await api.post(`/projects/${projectId}/infrastructure/scale`, {
      containerId,
      targetReplicas,
    });
    return res.data;
  },

  deployRelease: async (projectId, { versionTag, strategy }) => {
    const res = await api.post(`/projects/${projectId}/infrastructure/release`, {
      versionTag,
      strategy,
    });
    return res.data;
  },
};
