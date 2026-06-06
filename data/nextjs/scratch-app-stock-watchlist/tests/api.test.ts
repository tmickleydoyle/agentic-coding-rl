import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../reference/app/api/stocks/route';
import { __reset } from '../reference/lib/store';

beforeEach(() => { __reset(); });

describe('API /api/stocks', () => {
  it('GET returns seed stocks', async () => {
    const res = GET();
    const data = await res.json();
    expect(data.stocks).toHaveLength(2);
  });

  it('POST adds a stock', async () => {
    const req = new Request('http://localhost/api/stocks', {
      method: 'POST',
      body: JSON.stringify({ ticker: 'TSLA', name: 'Tesla', price: 250, quantity: 3, currency: 'USD' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.stock.ticker).toBe('TSLA');
  });

  it('POST rejects duplicate ticker', async () => {
    const req = new Request('http://localhost/api/stocks', {
      method: 'POST',
      body: JSON.stringify({ ticker: 'aapl', name: 'Apple', price: 200, quantity: 1, currency: 'USD' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('POST auto-uppercases ticker', async () => {
    const req = new Request('http://localhost/api/stocks', {
      method: 'POST',
      body: JSON.stringify({ ticker: 'tsla', name: 'Tesla', price: 250, quantity: 1, currency: 'USD' }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.stock.ticker).toBe('TSLA');
  });

  it('DELETE removes a stock', async () => {
    const req = new Request('http://localhost/api/stocks?id=stk1');
    const res = DELETE(req);
    expect((await res.json()).ok).toBe(true);
    const listRes = GET();
    const data = await listRes.json();
    expect(data.stocks).toHaveLength(1);
  });

  it('POST rejects non-positive price', async () => {
    const req = new Request('http://localhost/api/stocks', {
      method: 'POST',
      body: JSON.stringify({ ticker: 'XYZ', name: 'Test', price: 0, quantity: 1, currency: 'USD' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
