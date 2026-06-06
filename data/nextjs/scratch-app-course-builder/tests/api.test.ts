import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE, PATCH } from '../app/api/courses/route';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('GET /api/courses', () => {
  it('returns course, modules, lessons', async () => {
    const res = await GET(new Request('http://localhost/api/courses'));
    const data = await res.json();
    expect(data.course.title).toBe('Introduction to Programming');
    expect(data.modules).toHaveLength(2);
    expect(data.lessons).toHaveLength(3);
  });
});

describe('POST /api/courses (module)', () => {
  it('adds a module', async () => {
    const res = await POST(new Request('http://localhost/api/courses?type=module', { method: 'POST', body: JSON.stringify({ title: 'Advanced Topics' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(201);
    const mod = await res.json();
    expect(mod.title).toBe('Advanced Topics');
    expect(mod.order).toBe(3);
  });

  it('returns 400 for empty title', async () => {
    const res = await POST(new Request('http://localhost/api/courses?type=module', { method: 'POST', body: JSON.stringify({ title: '' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/courses (module)', () => {
  it('removes a module and its lessons', async () => {
    const res = await DELETE(new Request('http://localhost/api/courses?type=module', { method: 'DELETE', body: JSON.stringify({ id: 1 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(204);
    const getRes = await GET(new Request('http://localhost/api/courses'));
    const data = await getRes.json();
    expect(data.lessons.filter((l: { moduleId: number }) => l.moduleId === 1)).toHaveLength(0);
  });
});

describe('PATCH /api/courses (publish)', () => {
  it('toggles published state', async () => {
    const res = await PATCH(new Request('http://localhost/api/courses?type=publish', { method: 'PATCH' }));
    const data = await res.json();
    expect(data.published).toBe(true);
  });
});
