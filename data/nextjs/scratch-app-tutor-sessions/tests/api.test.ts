import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, PATCH } from '../app/api/sessions/route';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('GET /api/sessions', () => {
  it('returns tutors and sessions', async () => {
    const res = await GET(new Request('http://localhost/api/sessions'));
    const data = await res.json();
    expect(data.tutors).toHaveLength(3);
    expect(data.sessions).toHaveLength(3);
  });
});

describe('POST /api/sessions', () => {
  it('books a session', async () => {
    const res = await POST(new Request('http://localhost/api/sessions', { method: 'POST', body: JSON.stringify({ tutorId: 1, studentName: 'Dave', date: '2024-02-10', time: '11:00', duration: 60 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(201);
    const s = await res.json();
    expect(s.studentName).toBe('Dave');
    expect(s.status).toBe('scheduled');
  });

  it('returns 400 for invalid duration', async () => {
    const res = await POST(new Request('http://localhost/api/sessions', { method: 'POST', body: JSON.stringify({ tutorId: 1, studentName: 'Dave', date: '2024-02-10', time: '11:00', duration: 50 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });

  it('returns 400 for unavailable tutor', async () => {
    const res = await POST(new Request('http://localhost/api/sessions', { method: 'POST', body: JSON.stringify({ tutorId: 3, studentName: 'Dave', date: '2024-02-10', time: '11:00', duration: 60 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/sessions', () => {
  it('cancels a session', async () => {
    const res = await PATCH(new Request('http://localhost/api/sessions', { method: 'PATCH', body: JSON.stringify({ id: 2, status: 'cancelled' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.ok).toBe(true);
    const s = await res.json();
    expect(s.status).toBe('cancelled');
  });

  it('returns 400 for already-cancelled', async () => {
    await PATCH(new Request('http://localhost/api/sessions', { method: 'PATCH', body: JSON.stringify({ id: 2, status: 'cancelled' }), headers: { 'Content-Type': 'application/json' } }));
    const res = await PATCH(new Request('http://localhost/api/sessions', { method: 'PATCH', body: JSON.stringify({ id: 2, status: 'cancelled' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });
});
