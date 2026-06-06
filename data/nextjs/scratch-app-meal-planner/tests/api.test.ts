import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../reference/app/api/recipes/route';
import { __reset } from '../reference/lib/store';

beforeEach(() => { __reset(); });

describe('API /api/recipes', () => {
  it('GET returns 2 seed recipes', async () => {
    const res = GET();
    const data = await res.json();
    expect(data.recipes).toHaveLength(2);
  });

  it('POST creates a recipe', async () => {
    const req = new Request('http://localhost/api/recipes', {
      method: 'POST',
      body: JSON.stringify({ name: 'Salad', ingredients: ['lettuce', 'tomato'], servings: 1, prepMinutes: 5, tags: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.recipe.name).toBe('Salad');
  });

  it('POST rejects empty ingredients', async () => {
    const req = new Request('http://localhost/api/recipes', {
      method: 'POST',
      body: JSON.stringify({ name: 'Bad', ingredients: [], servings: 1, prepMinutes: 0, tags: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('POST rejects empty name', async () => {
    const req = new Request('http://localhost/api/recipes', {
      method: 'POST',
      body: JSON.stringify({ name: '', ingredients: ['egg'], servings: 1, prepMinutes: 0, tags: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('DELETE removes a recipe', async () => {
    const req = new Request('http://localhost/api/recipes?id=rc1');
    const res = DELETE(req);
    expect((await res.json()).ok).toBe(true);
    const data = await (GET()).json();
    expect(data.recipes).toHaveLength(1);
  });

  it('GET reflects additions', async () => {
    const req = new Request('http://localhost/api/recipes', {
      method: 'POST',
      body: JSON.stringify({ name: 'Soup', ingredients: ['broth', 'vegetables'], servings: 3, prepMinutes: 30, tags: ['dinner'] }),
    });
    await POST(req);
    const data = await (GET()).json();
    expect(data.recipes).toHaveLength(3);
  });
});
