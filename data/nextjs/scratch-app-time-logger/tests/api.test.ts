import { describe, it, expect, beforeEach } from 'vitest';
import { __reset } from '../lib/store';
import { GET, POST, DELETE } from '../app/api/logs/route';

beforeEach(() => { __reset(); });

describe('GET /api/logs', () => {
  it('returns 4 seed entries', async () => {
    const res = await GET(new Request('http://localhost/api/logs'));
    const data = await res.json();
    expect(data.length).toBe(4);
  });

  it('returns projects with ?type=projects', async () => {
    const res = await GET(new Request('http://localhost/api/logs?type=projects'));
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});

describe('POST /api/logs', () => {
  it('adds a time entry', async () => {
    const req = new Request('http://localhost/api/logs', {
      method: 'POST',
      body: JSON.stringify({ projectId: 'p1', description: 'Design work', hours: 2, date: '2026-06-05' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it('rejects empty description', async () => {
    const req = new Request('http://localhost/api/logs', {
      method: 'POST',
      body: JSON.stringify({ projectId: 'p1', description: '', hours: 2, date: '2026-06-05' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('adds a project', async () => {
    const req = new Request('http://localhost/api/logs', {
      method: 'POST',
      body: JSON.stringify({ type: 'project', name: 'Docs', color: '#ff0000' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it('rejects duplicate project', async () => {
    const req = new Request('http://localhost/api/logs', {
      method: 'POST',
      body: JSON.stringify({ type: 'project', name: 'Mobile App', color: '#ff0000' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
  });
});

describe('DELETE /api/logs', () => {
  it('deletes an entry', async () => {
    const res = await DELETE(new Request('http://localhost/api/logs?id=te1', { method: 'DELETE' }));
    expect(res.status).toBe(200);
  });

  it('returns 404 for unknown', async () => {
    const res = await DELETE(new Request('http://localhost/api/logs?id=x99', { method: 'DELETE' }));
    expect(res.status).toBe(404);
  });

  it('returns 400 when no id', async () => {
    const res = await DELETE(new Request('http://localhost/api/logs', { method: 'DELETE' }));
    expect(res.status).toBe(400);
  });
});
