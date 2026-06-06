import { describe, it, expect, beforeEach } from 'vitest';
import { __reset } from '../lib/store';
import { GET, POST, DELETE, PATCH } from '../app/api/notes/route';

beforeEach(() => { __reset(); });

describe('GET /api/notes', () => {
  it('returns all 4 notes', async () => {
    const res = await GET(new Request('http://localhost/api/notes'));
    const data = await res.json();
    expect(data.length).toBe(4);
  });

  it('filters archived', async () => {
    const res = await GET(new Request('http://localhost/api/notes?archived=true'));
    const data = await res.json();
    expect(data.every((n: { archived: boolean }) => n.archived)).toBe(true);
    expect(data.length).toBe(1);
  });

  it('filters active', async () => {
    const res = await GET(new Request('http://localhost/api/notes?archived=false'));
    const data = await res.json();
    expect(data.every((n: { archived: boolean }) => !n.archived)).toBe(true);
    expect(data.length).toBe(3);
  });
});

describe('POST /api/notes', () => {
  it('adds a note', async () => {
    const req = new Request('http://localhost/api/notes', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test', body: 'Hello', tags: ['test'] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it('rejects empty title', async () => {
    const req = new Request('http://localhost/api/notes', {
      method: 'POST',
      body: JSON.stringify({ title: '' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/notes', () => {
  it('deletes note', async () => {
    const res = await DELETE(new Request('http://localhost/api/notes?id=n1', { method: 'DELETE' }));
    expect(res.status).toBe(200);
  });

  it('returns 404 for missing', async () => {
    const res = await DELETE(new Request('http://localhost/api/notes?id=x99', { method: 'DELETE' }));
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/notes', () => {
  it('archives a note', async () => {
    const req = new Request('http://localhost/api/notes?id=n1', {
      method: 'PATCH',
      body: JSON.stringify({ archived: true }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
  });
});
