import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../reference/app/api/transactions/route';
import { __reset } from '../reference/lib/store';

beforeEach(() => { __reset(); });

describe('API /api/transactions', () => {
  it('GET returns seed transactions', async () => {
    const res = GET();
    const data = await res.json();
    expect(data.transactions).toHaveLength(3);
  });

  it('POST creates a transaction', async () => {
    const req = new Request('http://localhost/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ description: 'Lunch', amount: -12, category: 'cat2', date: '2024-01-10' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.transaction.description).toBe('Lunch');
  });

  it('POST rejects zero amount', async () => {
    const req = new Request('http://localhost/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ description: 'Test', amount: 0, category: 'cat1', date: '2024-01-10' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('DELETE removes a transaction', async () => {
    const req = new Request('http://localhost/api/transactions?id=t1');
    const res = DELETE(req);
    expect((await res.json()).ok).toBe(true);
    const listRes = GET();
    const data = await listRes.json();
    expect(data.transactions).toHaveLength(2);
  });

  it('POST returns transaction with id', async () => {
    const req = new Request('http://localhost/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ description: 'New', amount: 100, category: 'cat1', date: '2024-01-15' }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.transaction.id).toBeTruthy();
  });
});
