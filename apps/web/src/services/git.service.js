import { api } from './api';

export const gitService = {
  getBranches: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/git/branches`);
    return res.data;
  },

  createBranch: async (projectId, { name, baseBranch, commitMessage, modifiedFiles }) => {
    const res = await api.post(`/projects/${projectId}/git/branches`, {
      name,
      baseBranch,
      commitMessage,
      modifiedFiles,
    });
    return res.data;
  },

  createPR: async (projectId, { title, body, sourceBranch, targetBranch }) => {
    const res = await api.post(`/projects/${projectId}/git/pull-requests`, {
      title,
      body,
      sourceBranch,
      targetBranch,
    });
    return res.data;
  },

  getPipelines: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/git/pipelines`);
    return res.data;
  },

  triggerPipeline: async (projectId, { branch, commitHash, environment }) => {
    const res = await api.post(`/projects/${projectId}/git/pipelines/trigger`, {
      branch,
      commitHash,
      environment,
    });
    return res.data;
  },
};
