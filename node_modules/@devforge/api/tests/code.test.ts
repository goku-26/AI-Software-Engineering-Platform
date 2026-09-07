import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Code Intelligence API Security', () => {
  it('GET /api/projects/:id/files without token should return 401 unauthorized', async () => {
    const res = await request(app).get('/api/projects/proj_sample_01/files');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/projects/:id/search without token should return 401 unauthorized', async () => {
    const res = await request(app).get('/api/projects/proj_sample_01/search?q=jwt');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
