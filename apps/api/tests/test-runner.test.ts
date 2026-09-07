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

describe('Automated Testing API Layer', () => {
  it('POST /api/projects/:id/tests/run without token should return 401 unauthorized', async () => {
    const res = await request(app).post('/api/projects/proj_sample_01/tests/run');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/projects/:id/tests/history with token should return test history and health score', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .get('/api/projects/proj_sample_01/tests/history')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].healthScore).toBeGreaterThanOrEqual(0);
  });

  it('POST /api/projects/:id/tests/run with token should execute test suite and return pass/fail metrics', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/projects/proj_sample_01/tests/run')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.runId).toBeDefined();
    expect(res.body.data.totalTests).toBeGreaterThan(0);
    expect(res.body.data.healthScore).toBe(100);
  });

  it('POST /api/projects/:id/tests/generate with token should produce automated unit test code', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/projects/proj_sample_01/tests/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        filePath: 'src/controllers/authController.js',
        testType: 'unit',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.testFilePath).toBeDefined();
    expect(res.body.data.generatedTestCode).toContain('describe');
  });
});
