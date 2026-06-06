import { describe, it, expect, beforeEach } from 'vitest';
import { __reset } from '../lib/store';
import { GET, POST, PATCH } from '../app/api/tasks/route';

beforeEach(() => { __reset(); });

describe('GET /api/tasks', () => {
  it('returns 4 seed tasks', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.length).toBe(4);
  });
});

describe('POST /api/tasks', () => {
  it('adds a valid task', async () => {
    const req = new Request('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'New task', label: 'Bug', priority: 'low' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.status).toBe('todo');
  });

  it('rejects empty title', async () => {
    const req = new Request('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: '', label: 'Bug' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/tasks', () => {
  it('moves task forward', async () => {
    const res = await PATCH(new Request('http://localhost/api/tasks?id=t1', { method: 'PATCH' }));
    expect(res.status).toBe(200);
    const tasks = await (await GET()).json();
    const t1 = tasks.find((t: { id: string }) => t.id === 't1');
    expect(t1.status).toBe('inprogress');
  });

  it('reopens done task', async () => {
    const res = await PATCH(new Request('http://localhost/api/tasks?id=t3&action=reopen', { method: 'PATCH' }));
    expect(res.status).toBe(200);
    const tasks = await (await GET()).json();
    const t3 = tasks.find((t: { id: string }) => t.id === 't3');
    expect(t3.status).toBe('todo');
  });

  it('returns 404 for unknown id', async () => {
    const res = await PATCH(new Request('http://localhost/api/tasks?id=x999', { method: 'PATCH' }));
    expect(res.status).toBe(404);
  });
});
