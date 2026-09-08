import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { generateToken } from '../src/utils/jwt';

const app = createApp();

const generateTestToken = () => {
  return generateToken({
    userId: 'user_test_infra_100',
    email: 'infra-tester@devforge.ai',
    role: 'developer',
  });
};

describe('Phase 10 — Enterprise Cloud Infrastructure & Production Release API Layer', () => {
  it('GET /api/projects/:id/infrastructure/topology without token should return 401 unauthorized', async () => {
    const res = await request(app).get('/api/projects/proj_sample_01/infrastructure/topology');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/projects/:id/infrastructure/topology with token should return cluster topology metrics & containers', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .get('/api/projects/proj_sample_01/infrastructure/topology')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.clusterHealthScore).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data.containers)).toBe(true);
    expect(Array.isArray(res.body.data.registryImages)).toBe(true);
    expect(Array.isArray(res.body.data.envSecrets)).toBe(true);
    expect(res.body.data.activeRelease.releaseId).toBeDefined();
    expect(res.body.data.containers.length).toBeGreaterThan(0);
  });

  it('POST /api/projects/:id/infrastructure/build without body should fail validation (400)', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/projects/proj_sample_01/infrastructure/build')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/projects/:id/infrastructure/build with valid payload should build and return Docker image', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/projects/proj_sample_01/infrastructure/build')
      .set('Authorization', `Bearer ${token}`)
      .send({ repository: 'devforge/api', tag: 'v1.11.0' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.repository).toBe('devforge/api');
    expect(res.body.data.tag).toBe('v1.11.0');
    expect(res.body.data.digest).toContain('sha256:');
  });

  it('POST /api/projects/:id/infrastructure/scale should update service replica count', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/projects/proj_sample_01/infrastructure/scale')
      .set('Authorization', `Bearer ${token}`)
      .send({ containerId: 'node_api_01', targetReplicas: 5 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.replicas).toBe(5);
  });

  it('POST /api/projects/:id/infrastructure/release should trigger production release rollout', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/projects/proj_sample_01/infrastructure/release')
      .set('Authorization', `Bearer ${token}`)
      .send({ versionTag: 'v1.11.0-release', strategy: 'canary' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.versionTag).toBe('v1.11.0-release');
    expect(res.body.data.strategy).toBe('canary');
    expect(res.body.data.releaseId).toBeDefined();
  });
});
