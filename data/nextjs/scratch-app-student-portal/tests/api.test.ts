import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, PATCH } from '../app/api/portal/route';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('GET /api/portal', () => {
  it('returns student, courses, progress', async () => {
    const res = await GET(new Request('http://localhost/api/portal'));
    const data = await res.json();
    expect(data.student.name).toBe('Alex Rivera');
    expect(data.courses).toHaveLength(4);
    expect(data.progress).toHaveLength(2);
  });
});

describe('POST /api/portal (enroll)', () => {
  it('enrolls in a course', async () => {
    const res = await POST(new Request('http://localhost/api/portal?type=enroll', { method: 'POST', body: JSON.stringify({ courseId: 3 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.ok).toBe(true);
  });

  it('returns 409 for already-enrolled', async () => {
    const res = await POST(new Request('http://localhost/api/portal?type=enroll', { method: 'POST', body: JSON.stringify({ courseId: 1 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(409);
  });
});

describe('POST /api/portal (drop)', () => {
  it('drops an enrolled course', async () => {
    const res = await POST(new Request('http://localhost/api/portal?type=drop', { method: 'POST', body: JSON.stringify({ courseId: 1 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.ok).toBe(true);
  });

  it('returns 400 for not-enrolled course', async () => {
    const res = await POST(new Request('http://localhost/api/portal?type=drop', { method: 'POST', body: JSON.stringify({ courseId: 3 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/portal (profile)', () => {
  it('updates student name', async () => {
    const res = await PATCH(new Request('http://localhost/api/portal?type=profile', { method: 'PATCH', body: JSON.stringify({ name: 'Alex Smith' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.ok).toBe(true);
  });

  it('returns 400 for empty name', async () => {
    const res = await PATCH(new Request('http://localhost/api/portal?type=profile', { method: 'PATCH', body: JSON.stringify({ name: '' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });
});
