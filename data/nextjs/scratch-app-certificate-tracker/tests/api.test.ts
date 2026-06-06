import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../app/api/certificates/route';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('GET /api/certificates', () => {
  it('returns skills and certificates', async () => {
    const res = await GET(new Request('http://localhost/api/certificates'));
    const data = await res.json();
    expect(data.skills).toHaveLength(4);
    expect(data.certificates).toHaveLength(2);
  });
});

describe('POST /api/certificates (skill)', () => {
  it('adds a skill', async () => {
    const res = await POST(new Request('http://localhost/api/certificates?type=skill', { method: 'POST', body: JSON.stringify({ name: 'TypeScript', category: 'Programming', requiredHours: 30 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(201);
    const s = await res.json();
    expect(s.name).toBe('TypeScript');
  });
});

describe('POST /api/certificates (certificate)', () => {
  it('issues a certificate', async () => {
    const res = await POST(new Request('http://localhost/api/certificates?type=certificate', { method: 'POST', body: JSON.stringify({ skillId: 2, recipientName: 'Dave', issuedDate: '2024-02-01', hoursCompleted: 45 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(201);
  });

  it('returns 400 for insufficient hours', async () => {
    const res = await POST(new Request('http://localhost/api/certificates?type=certificate', { method: 'POST', body: JSON.stringify({ skillId: 1, recipientName: 'Dave', issuedDate: '2024-02-01', hoursCompleted: 10 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/certificates (skill)', () => {
  it('deletes a skill with no certs', async () => {
    const res = await DELETE(new Request('http://localhost/api/certificates?type=skill', { method: 'DELETE', body: JSON.stringify({ id: 2 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(204);
  });

  it('returns 400 for skill with certificates', async () => {
    const res = await DELETE(new Request('http://localhost/api/certificates?type=skill', { method: 'DELETE', body: JSON.stringify({ id: 1 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });
});
