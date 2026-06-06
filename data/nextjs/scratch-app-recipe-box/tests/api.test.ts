import { describe, it, expect, beforeEach } from 'vitest';
import { __reset } from '../lib/store';
import { GET, POST, PATCH } from '../app/api/recipes/route';

beforeEach(() => { __reset(); });

describe('GET /api/recipes', () => {
  it('returns 3 seed recipes', async () => {
    const res = await GET(new Request('http://localhost/api/recipes'));
    const data = await res.json();
    expect(data.length).toBe(3);
  });

  it('returns ingredients with ?type=ingredients', async () => {
    const res = await GET(new Request('http://localhost/api/recipes?type=ingredients'));
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.includes('pasta')).toBe(true);
  });

  it('returns only favorites with ?type=favorites', async () => {
    const res = await GET(new Request('http://localhost/api/recipes?type=favorites'));
    const data = await res.json();
    expect(data.every((r: { favorite: boolean }) => r.favorite)).toBe(true);
    expect(data.length).toBe(2);
  });
});

describe('POST /api/recipes', () => {
  it('adds a valid recipe', async () => {
    const req = new Request('http://localhost/api/recipes', {
      method: 'POST',
      body: JSON.stringify({ title: 'Toast', cuisine: 'British', prepTime: 5, ingredients: ['bread'], instructions: 'Toast it.' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it('rejects missing title', async () => {
    const req = new Request('http://localhost/api/recipes', {
      method: 'POST',
      body: JSON.stringify({ title: '', cuisine: 'X', prepTime: 5, instructions: 'y' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/recipes', () => {
  it('toggles favorite', async () => {
    const res = await PATCH(new Request('http://localhost/api/recipes?id=r2', { method: 'PATCH' }));
    expect(res.status).toBe(200);
  });

  it('returns 404 for unknown id', async () => {
    const res = await PATCH(new Request('http://localhost/api/recipes?id=x99', { method: 'PATCH' }));
    expect(res.status).toBe(404);
  });
});
