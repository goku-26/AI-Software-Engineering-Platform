import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { generateToken } from '../src/utils/jwt';

const app = createApp();

const generateTestToken = () => {
  return generateToken({
    userId: 'user_test_dep_999',
    email: 'dep-tester@devforge.ai',
    role: 'developer',
  });
};

describe('Phase 9 — Multi-Repository Monorepo & Dependency Intelligence API Layer', () => {
  it('GET /api/projects/:id/dependencies/graph without token should return 401 unauthorized', async () => {
    const res = await request(app).get('/api/projects/proj_sample_01/dependencies/graph');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/projects/:id/dependencies/graph with token should return dependency report and items', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .get('/api/projects/proj_sample_01/dependencies/graph')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reportId).toBeDefined();
    expect(res.body.data.monorepoHealthScore).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(res.body.data.dependencies)).toBe(true);
    expect(Array.isArray(res.body.data.symbolImpacts)).toBe(true);
    expect(res.body.data.dependencies.length).toBeGreaterThan(0);
  });

  it('POST /api/projects/:id/dependencies/impact-analysis without body should fail validation (400)', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/projects/proj_sample_01/dependencies/impact-analysis')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/projects/:id/dependencies/impact-analysis with valid symbolName should return symbol impact analysis', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/projects/proj_sample_01/dependencies/impact-analysis')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbolName: 'UserAuthPayload' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.symbolName).toBe('UserAuthPayload');
    expect(Array.isArray(res.body.data.affectedServices)).toBe(true);
    expect(res.body.data.breakingRiskLevel).toBe('high');
    expect(res.body.data.refactorRecommendation).toContain('UserAuthPayload');
  });

  it('POST /api/projects/:id/dependencies/refactor should sync dependency version', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/projects/proj_sample_01/dependencies/refactor')
      .set('Authorization', `Bearer ${token}`)
      .send({ dependencyId: 'dep_04', targetVersion: '1.6.1' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toContain('updated');
    expect(Array.isArray(res.body.data.updatedPackages)).toBe(true);
  });
});
