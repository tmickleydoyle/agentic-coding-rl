import { describe, it, expect, beforeEach } from 'vitest';
import { __reset } from '../reference/lib/store';
import { GET, POST, DELETE } from '../reference/app/api/brews/route';

beforeEach(() => __reset());

describe('GET /api/brews', () => {
  it('returns seed brews', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});

describe('POST /api/brews', () => {
  it('creates a brew', async () => {
    const req = new Request('http://localhost/api/brews', {
      method: 'POST',
      body: JSON.stringify({ beanId: 'b1', method: 'aeropress', date: '2025-11-01', rating: 5, notes: 'Excellent' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.method).toBe('aeropress');
  });

  it('returns 400 when missing rating', async () => {
    const req = new Request('http://localhost/api/brews', {
      method: 'POST',
      body: JSON.stringify({ beanId: 'b1', method: 'espresso', date: '2025-11-01' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/brews', () => {
  it('deletes a brew', async () => {
    const req = new Request('http://localhost/api/brews?id=br1', { method: 'DELETE' });
    await DELETE(req);
    const listRes = await GET();
    const data = await listRes.json();
    expect(data.length).toBe(2);
  });

  it('returns 400 without id', async () => {
    const req = new Request('http://localhost/api/brews', { method: 'DELETE' });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
