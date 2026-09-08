import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { generateToken } from '../src/utils/jwt';

const app = createApp();

const generateTestToken = () => {
  return generateToken({
    userId: 'user_test_security_123',
    email: 'sec-tester@devforge.ai',
    role: 'developer',
  });
};

describe('Phase 6 — Security Scan Engine API Layer', () => {
  it('POST /api/projects/:id/security/scan without token should return 401 unauthorized', async () => {
    const res = await request(app).post('/api/projects/proj_sample_01/security/scan');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/projects/:id/security/scan with token should execute SAST vulnerability scan', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/projects/proj_sample_01/security/scan')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.scanId).toBeDefined();
    expect(res.body.data.totalVulnerabilities).toBeGreaterThan(0);
    expect(res.body.data.securityScore).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(res.body.data.vulnerabilities)).toBe(true);
  });

  it('GET /api/projects/:id/security/history with token should return historical security reports', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .get('/api/projects/proj_sample_01/security/history')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].scanId).toBeDefined();
  });

  it('POST /api/projects/:id/security/remediate should generate AI security patch and explanation', async () => {
    const token = generateTestToken();
    const res = await request(app)
      .post('/api/projects/proj_sample_01/security/remediate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vulnerabilityId: 'vuln_01_test',
        filePath: 'src/controllers/authController.js',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.remediatedCode).toContain('DevForge AI Security Remediation');
    expect(res.body.data.explanation).toContain('CWE');
  });

  it('POST /api/projects/:id/security/apply-remediation should apply remediated patch to workspace', async () => {
    const token = generateTestToken();
    
    // First generate remediation
    await request(app)
      .post('/api/projects/proj_sample_01/security/remediate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vulnerabilityId: 'vuln_01_test',
        filePath: 'src/controllers/authController.js',
      });

    // Then apply patch
    const res = await request(app)
      .post('/api/projects/proj_sample_01/security/apply-remediation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vulnerabilityId: 'vuln_01_test',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toContain('applied');
  });
});
