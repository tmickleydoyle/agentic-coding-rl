import { describe, it, expect, beforeEach } from 'vitest';
import { __reset } from '../lib/store';
import { GET, POST, DELETE } from '../app/api/quizzes/route';

beforeEach(() => { __reset(); });

describe('GET /api/quizzes', () => {
  it('returns 2 seed quizzes', async () => {
    const res = await GET(new Request('http://localhost/api/quizzes'));
    const data = await res.json();
    expect(data.length).toBe(2);
  });

  it('returns questions with ?type=questions', async () => {
    const res = await GET(new Request('http://localhost/api/quizzes?type=questions'));
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});

describe('POST /api/quizzes', () => {
  it('adds a quiz', async () => {
    const req = new Request('http://localhost/api/quizzes', {
      method: 'POST',
      body: JSON.stringify({ title: 'History', description: 'Historical facts' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe('History');
  });

  it('rejects empty title', async () => {
    const req = new Request('http://localhost/api/quizzes', {
      method: 'POST',
      body: JSON.stringify({ title: '' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('adds a question', async () => {
    const req = new Request('http://localhost/api/quizzes', {
      method: 'POST',
      body: JSON.stringify({ type: 'question', quizId: 'q1', text: 'Test?', options: ['A', 'B', 'C', 'D'], correctIndex: 0 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});

describe('DELETE /api/quizzes', () => {
  it('deletes a quiz', async () => {
    const res = await DELETE(new Request('http://localhost/api/quizzes?id=q1', { method: 'DELETE' }));
    expect(res.status).toBe(200);
    const after = await GET(new Request('http://localhost/api/quizzes'));
    const data = await after.json();
    expect(data.length).toBe(1);
  });

  it('returns 404 for unknown', async () => {
    const res = await DELETE(new Request('http://localhost/api/quizzes?id=x99', { method: 'DELETE' }));
    expect(res.status).toBe(404);
  });
});
