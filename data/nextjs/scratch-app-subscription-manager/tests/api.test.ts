import { describe, it, expect, beforeEach } from 'vitest';
import { __reset } from '../reference/lib/store';
import { GET, POST, PATCH, DELETE } from '../reference/app/api/subscriptions/route';

beforeEach(() => __reset());

describe('GET /api/subscriptions', () => {
  it('returns seed data', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});

describe('POST /api/subscriptions', () => {
  it('creates subscription', async () => {
    const req = new Request('http://localhost/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ name: 'Hulu', monthlyCost: 8, billingDay: 10, category: 'Entertainment', status: 'active' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe('Hulu');
  });

  it('returns 400 for invalid billingDay', async () => {
    const req = new Request('http://localhost/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ name: 'X', monthlyCost: 5, billingDay: 32, category: 'Y' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for zero cost', async () => {
    const req = new Request('http://localhost/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ name: 'X', monthlyCost: 0, billingDay: 5, category: 'Y' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/subscriptions', () => {
  it('toggles status', async () => {
    const req = new Request('http://localhost/api/subscriptions?id=s1', { method: 'PATCH' });
    await PATCH(req);
    const listRes = await GET();
    const data = await listRes.json();
    const s = data.find((x: { id: string }) => x.id === 's1');
    expect(s.status).toBe('paused');
  });
});

describe('DELETE /api/subscriptions', () => {
  it('deletes subscription', async () => {
    const req = new Request('http://localhost/api/subscriptions?id=s1', { method: 'DELETE' });
    await DELETE(req);
    const res = await GET();
    const data = await res.json();
    expect(data.length).toBe(2);
  });

  it('returns 400 without id', async () => {
    const req = new Request('http://localhost/api/subscriptions', { method: 'DELETE' });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
