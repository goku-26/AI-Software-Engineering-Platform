import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { generateToken } from '../src/utils/jwt';

const app = createApp();

const generateTestToken = () => {
  return generateToken({
    userId: 'user_test_123',
    email: 'test@devforge.ai',
    role: 'developer',
  });
};


describe('AI Agent API Layer', () => {
  it('POST /api/projects/:id/agent/execute without token should return 401 unauthorized', async () => {
    const res = await request(app)
      .post('/api/projects/proj_sample_01/agent/execute')
      .send({ prompt: 'Refactor auth controller error handling' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/projects/:id/agent/tasks with token should return task history', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .get('/api/projects/proj_sample_01/agent/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/projects/:id/agent/execute with token should execute agent task and return steps + patch', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/projects/proj_sample_01/agent/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({
        prompt: 'Add strict payload validation and JWT expiration',
        role: 'coder',
        targetFiles: ['src/controllers/authController.js'],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.role).toBe('coder');
    expect(res.body.data.steps.length).toBe(3);
    expect(res.body.data.generatedPatch).toBeDefined();
    expect(res.body.data.generatedPatch.filePath).toBe('src/controllers/authController.js');
  });

  it('POST /api/projects/:id/agent/tasks/:taskId/apply should mark patch as applied', async () => {
    const token = generateTestToken();
    
    // First create a task
    const execRes = await request(app)
      .post('/api/projects/proj_sample_01/agent/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({
        prompt: 'Fix authorization error handling guard',
        role: 'debugger',
      });

    const taskId = execRes.body.data.id;

    // Apply the patch
    const applyRes = await request(app)
      .post(`/api/projects/proj_sample_01/agent/tasks/${taskId}/apply`)
      .set('Authorization', `Bearer ${token}`);

    expect(applyRes.status).toBe(200);
    expect(applyRes.body.success).toBe(true);
    expect(applyRes.body.data.filePath).toBeDefined();
  });
});
