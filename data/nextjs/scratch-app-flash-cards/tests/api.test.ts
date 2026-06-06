import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../reference/app/api/cards/route';
import { __reset } from '../reference/lib/store';

beforeEach(() => { __reset(); });

describe('API /api/cards', () => {
  it('GET all cards', async () => {
    const req = new Request('http://localhost/api/cards');
    const res = GET(req);
    const data = await res.json();
    expect(data.cards).toHaveLength(3);
  });

  it('GET filters by deckId', async () => {
    const req = new Request('http://localhost/api/cards?deckId=d1');
    const res = GET(req);
    const data = await res.json();
    expect(data.cards).toHaveLength(2);
  });

  it('POST creates a card', async () => {
    const req = new Request('http://localhost/api/cards', {
      method: 'POST',
      body: JSON.stringify({ deckId: 'd1', front: 'Dog', back: 'Perro' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.card.front).toBe('Dog');
  });

  it('POST rejects empty front', async () => {
    const req = new Request('http://localhost/api/cards', {
      method: 'POST',
      body: JSON.stringify({ deckId: 'd1', front: '', back: 'back' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('DELETE removes a card', async () => {
    const req = new Request('http://localhost/api/cards?id=c1');
    const res = DELETE(req);
    const data = await res.json();
    expect(data.ok).toBe(true);
    const listReq = new Request('http://localhost/api/cards');
    const listRes = GET(listReq);
    const listData = await listRes.json();
    expect(listData.cards).toHaveLength(2);
  });

  it('GET d2 deck cards', async () => {
    const req = new Request('http://localhost/api/cards?deckId=d2');
    const res = GET(req);
    const data = await res.json();
    expect(data.cards).toHaveLength(1);
  });
});
