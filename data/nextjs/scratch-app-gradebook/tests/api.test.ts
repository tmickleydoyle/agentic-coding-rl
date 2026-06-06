import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../app/api/gradebook/route';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('GET /api/gradebook', () => {
  it('returns students, grades, subjects', async () => {
    const res = await GET(new Request('http://localhost/api/gradebook'));
    const data = await res.json();
    expect(data.students).toHaveLength(3);
    expect(data.grades).toHaveLength(4);
    expect(data.subjects).toContain('Math');
  });
});

describe('POST /api/gradebook (student)', () => {
  it('adds a student', async () => {
    const res = await POST(new Request('http://localhost/api/gradebook?type=student', { method: 'POST', body: JSON.stringify({ name: 'Dave' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(201);
    const s = await res.json();
    expect(s.name).toBe('Dave');
  });

  it('rejects empty name', async () => {
    const res = await POST(new Request('http://localhost/api/gradebook?type=student', { method: 'POST', body: JSON.stringify({ name: '' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/gradebook (grade)', () => {
  it('adds a grade', async () => {
    const res = await POST(new Request('http://localhost/api/gradebook?type=grade', { method: 'POST', body: JSON.stringify({ studentId: 1, subject: 'Math', score: 95, maxScore: 100 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(201);
  });

  it('rejects score > 100', async () => {
    const res = await POST(new Request('http://localhost/api/gradebook?type=grade', { method: 'POST', body: JSON.stringify({ studentId: 1, subject: 'Math', score: 101, maxScore: 100 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/gradebook (student)', () => {
  it('removes a student', async () => {
    const res = await DELETE(new Request('http://localhost/api/gradebook?type=student', { method: 'DELETE', body: JSON.stringify({ id: 1 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(204);
  });

  it('returns 404 for missing student', async () => {
    const res = await DELETE(new Request('http://localhost/api/gradebook?type=student', { method: 'DELETE', body: JSON.stringify({ id: 999 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(404);
  });
});
