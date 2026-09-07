import { api } from './api';

export const testService = {
  runTests: async (projectId) => {
    const res = await api.post(`/projects/${projectId}/tests/run`);
    return res.data;
  },

  getHistory: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/tests/history`);
    return res.data;
  },

  generateUnitTest: async (projectId, { filePath, testType }) => {
    const res = await api.post(`/projects/${projectId}/tests/generate`, {
      filePath,
      testType,
    });
    return res.data;
  },

  saveUnitTest: async (projectId, { filePath, testCode }) => {
    const res = await api.post(`/projects/${projectId}/tests/save`, {
      filePath,
      testCode,
    });
    return res.data;
  },
};
