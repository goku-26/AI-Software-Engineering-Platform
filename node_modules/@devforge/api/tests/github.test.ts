import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('GitHub API Security & Proxy', () => {
  it('GET /api/github/repositories without token should return 401 unauthorized', async () => {
    const res = await request(app).get('/api/github/repositories');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/github/import without token should return 401 unauthorized', async () => {
    const res = await request(app).post('/api/github/import').send({
      name: 'Test Repo Project',
      repositoryUrl: 'https://github.com/org/repo',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
