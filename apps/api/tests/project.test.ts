import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Project API Security', () => {
  it('GET /api/projects without token should return 401 unauthorized', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/projects without token should return 401 unauthorized', async () => {
    const res = await request(app).post('/api/projects').send({
      name: 'Test Project',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
