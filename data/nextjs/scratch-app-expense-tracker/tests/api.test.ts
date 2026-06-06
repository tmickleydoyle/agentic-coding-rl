import { describe, it, expect, beforeEach } from 'vitest';
import { __reset } from '../lib/store';
import { GET, POST, DELETE } from '../app/api/expenses/route';

beforeEach(() => { __reset(); });

describe('GET /api/expenses', () => {
  it('returns seed expenses', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.length).toBe(4);
  });
});

describe('POST /api/expenses', () => {
  it('adds a valid expense', async () => {
    const req = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ description: 'Tea', amount: 2.5, category: 'Food', date: '2026-06-05' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.description).toBe('Tea');
  });

  it('rejects empty description', async () => {
    const req = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ description: '', amount: 5, category: 'Food', date: '2026-06-05' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('rejects negative amount', async () => {
    const req = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ description: 'Bad', amount: -1, category: 'Food', date: '2026-06-05' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/expenses', () => {
  it('deletes existing expense', async () => {
    const req = new Request('http://localhost/api/expenses?id=e1', { method: 'DELETE' });
    const res = await DELETE(req);
    expect(res.status).toBe(200);
    const after = await GET();
    const data = await after.json();
    expect(data.length).toBe(3);
  });

  it('returns 404 for missing expense', async () => {
    const req = new Request('http://localhost/api/expenses?id=nonexistent', { method: 'DELETE' });
    const res = await DELETE(req);
    expect(res.status).toBe(404);
  });

  it('returns 400 when no id provided', async () => {
    const req = new Request('http://localhost/api/expenses', { method: 'DELETE' });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
