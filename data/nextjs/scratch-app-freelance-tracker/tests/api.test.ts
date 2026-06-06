import { describe, it, expect, beforeEach } from 'vitest';
import { __reset } from '../reference/lib/store';
import { GET, POST, PATCH, DELETE } from '../reference/app/api/invoices/route';

beforeEach(() => __reset());

describe('GET /api/invoices', () => {
  it('returns seed invoices', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.length).toBe(2);
  });
});

describe('POST /api/invoices', () => {
  it('creates a new invoice', async () => {
    const req = new Request('http://localhost/api/invoices', {
      method: 'POST',
      body: JSON.stringify({ projectId: 'p1', amount: 500, dueDate: '2026-01-01' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.amount).toBe(500);
    expect(data.status).toBe('unpaid');
  });

  it('returns 400 when missing dueDate', async () => {
    const req = new Request('http://localhost/api/invoices', {
      method: 'POST',
      body: JSON.stringify({ projectId: 'p1' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/invoices', () => {
  it('marks invoice paid', async () => {
    const req = new Request('http://localhost/api/invoices?id=i1', { method: 'PATCH' });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    const listRes = await GET();
    const data = await listRes.json();
    const inv = data.find((i: { id: string }) => i.id === 'i1');
    expect(inv.status).toBe('paid');
  });
});

describe('DELETE /api/invoices', () => {
  it('deletes invoice', async () => {
    const req = new Request('http://localhost/api/invoices?id=i1', { method: 'DELETE' });
    await DELETE(req);
    const listRes = await GET();
    const data = await listRes.json();
    expect(data.length).toBe(1);
  });

  it('returns 400 when missing id', async () => {
    const req = new Request('http://localhost/api/invoices', { method: 'DELETE' });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
