import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { generateToken } from '../src/utils/jwt';

const app = createApp();

const generateTestToken = () => {
  return generateToken({
    userId: 'user_test_obs_123',
    email: 'obs-tester@devforge.ai',
    role: 'developer',
  });
};

describe('Phase 8 — AI Observability & Analytics API Layer', () => {
  it('GET /api/projects/:id/observability/report without token should return 401 unauthorized', async () => {
    const res = await request(app).get('/api/projects/proj_sample_01/observability/report');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/projects/:id/observability/report with token should return token usage & cost stats', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .get('/api/projects/proj_sample_01/observability/report')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reportId).toBeDefined();
    expect(res.body.data.totalTokensConsumed).toBeGreaterThan(0);
    expect(res.body.data.totalCostUsd).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(res.body.data.modelProviderStats)).toBe(true);
    expect(Array.isArray(res.body.data.agentRoleStats)).toBe(true);
  });

  it('GET /api/projects/:id/observability/logs with token should return tool execution trace logs', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .get('/api/projects/proj_sample_01/observability/logs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].toolName).toBeDefined();
  });

  it('POST /api/projects/:id/observability/benchmark should trigger LLM Quality Evaluation audit', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/projects/proj_sample_01/observability/benchmark')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.benchmarkScore).toBeGreaterThanOrEqual(90);
    expect(res.body.data.details).toContain('Evaluated');
  });
});
