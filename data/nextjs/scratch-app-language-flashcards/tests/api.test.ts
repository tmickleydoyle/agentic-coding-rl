import { describe, it, expect, beforeEach } from 'vitest';
import { __reset } from '../reference/lib/store';
import { GET, POST, DELETE } from '../reference/app/api/decks/route';

beforeEach(() => __reset());

describe('GET /api/decks', () => {
  it('returns decks with cards', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.length).toBe(2);
    const d1 = data.find((d: { id: string }) => d.id === 'd1');
    expect(d1.cards.length).toBe(2);
  });
});

describe('POST /api/decks', () => {
  it('creates a deck', async () => {
    const req = new Request('http://localhost/api/decks', {
      method: 'POST',
      body: JSON.stringify({ name: 'Italian Basics', language: 'Italian' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe('Italian Basics');
  });

  it('returns 400 without language', async () => {
    const req = new Request('http://localhost/api/decks', {
      method: 'POST',
      body: JSON.stringify({ name: 'X' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/decks', () => {
  it('deletes deck and its cards', async () => {
    const req = new Request('http://localhost/api/decks?id=d1', { method: 'DELETE' });
    await DELETE(req);
    const listRes = await GET();
    const data = await listRes.json();
    expect(data.length).toBe(1);
    // d2 should still have its card
    expect(data[0].cards.length).toBe(1);
  });

  it('returns 400 without id', async () => {
    const req = new Request('http://localhost/api/decks', { method: 'DELETE' });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
