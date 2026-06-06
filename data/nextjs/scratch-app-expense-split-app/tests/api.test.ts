import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../reference/app/api/expenses/route';
import { __reset } from '../reference/lib/store';

beforeEach(() => { __reset(); });

describe('API /api/expenses', () => {
  it('GET returns all expenses', async () => {
    const req = new Request('http://localhost/api/expenses');
    const res = GET(req);
    const data = await res.json();
    expect(data.expenses).toHaveLength(2);
  });

  it('GET filters by groupId', async () => {
    const req = new Request('http://localhost/api/expenses?groupId=g1');
    const res = GET(req);
    const data = await res.json();
    expect(data.expenses).toHaveLength(2);
  });

  it('POST creates an expense', async () => {
    const req = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ groupId: 'g1', description: 'Taxi', amount: 60, paidBy: 'Carol', date: '2024-03-03' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.expense.description).toBe('Taxi');
  });

  it('POST rejects non-positive amount', async () => {
    const req = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ groupId: 'g1', description: 'Test', amount: -5, paidBy: 'Alice', date: '2024-03-04' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('DELETE removes an expense', async () => {
    const req = new Request('http://localhost/api/expenses?id=e1');
    const res = DELETE(req);
    expect((await res.json()).ok).toBe(true);
    const listReq = new Request('http://localhost/api/expenses');
    const data = await (GET(listReq)).json();
    expect(data.expenses).toHaveLength(1);
  });

  it('POST returns expense with id', async () => {
    const req = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ groupId: 'g1', description: 'Museum', amount: 45, paidBy: 'Bob', date: '2024-03-05' }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.expense.id).toBeTruthy();
  });
});
