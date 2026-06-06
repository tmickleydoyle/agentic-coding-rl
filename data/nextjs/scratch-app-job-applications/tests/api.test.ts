import { describe, it, expect, beforeEach } from 'vitest';
import { __reset } from '../reference/lib/store';
import { GET, POST, PATCH, DELETE } from '../reference/app/api/applications/route';

beforeEach(() => __reset());

describe('GET /api/applications', () => {
  it('returns seed applications', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.length).toBe(2);
  });
});

describe('POST /api/applications', () => {
  it('creates application', async () => {
    const req = new Request('http://localhost/api/applications', {
      method: 'POST',
      body: JSON.stringify({ company: 'NewCo', role: 'PM', appliedDate: '2025-11-01' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.company).toBe('NewCo');
    expect(data.status).toBe('applied');
  });

  it('returns 400 when missing company', async () => {
    const req = new Request('http://localhost/api/applications', {
      method: 'POST',
      body: JSON.stringify({ role: 'PM', appliedDate: '2025-11-01' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/applications', () => {
  it('updates status', async () => {
    const req = new Request('http://localhost/api/applications?id=a1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'interview' }),
    });
    await PATCH(req);
    const listRes = await GET();
    const data = await listRes.json();
    const app = data.find((a: { id: string }) => a.id === 'a1');
    expect(app.status).toBe('interview');
  });

  it('returns 400 without id', async () => {
    const req = new Request('http://localhost/api/applications', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'offer' }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/applications', () => {
  it('deletes application and linked data', async () => {
    const req = new Request('http://localhost/api/applications?id=a1', { method: 'DELETE' });
    await DELETE(req);
    const listRes = await GET();
    const data = await listRes.json();
    expect(data.length).toBe(1);
  });
});
