import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../app/api/attendance/route';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('GET /api/attendance', () => {
  it('returns students and records', async () => {
    const res = await GET(new Request('http://localhost/api/attendance'));
    const data = await res.json();
    expect(data.students).toHaveLength(4);
    expect(data.records).toHaveLength(6);
  });
});

describe('POST /api/attendance (student)', () => {
  it('adds a student', async () => {
    const res = await POST(new Request('http://localhost/api/attendance?type=student', { method: 'POST', body: JSON.stringify({ name: 'Eve' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(201);
    const s = await res.json();
    expect(s.name).toBe('Eve');
  });

  it('returns 400 for empty name', async () => {
    const res = await POST(new Request('http://localhost/api/attendance?type=student', { method: 'POST', body: JSON.stringify({ name: '' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/attendance (records)', () => {
  it('saves attendance records', async () => {
    const res = await POST(new Request('http://localhost/api/attendance?type=records', { method: 'POST', body: JSON.stringify({ date: '2024-01-20', records: [{ studentId: 1, status: 'present' }, { studentId: 2, status: 'absent' }] }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(201);
  });

  it('returns 400 for invalid status', async () => {
    const res = await POST(new Request('http://localhost/api/attendance?type=records', { method: 'POST', body: JSON.stringify({ date: '2024-01-20', records: [{ studentId: 1, status: 'invalid' }] }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/attendance (student)', () => {
  it('removes a student', async () => {
    const res = await DELETE(new Request('http://localhost/api/attendance?type=student', { method: 'DELETE', body: JSON.stringify({ id: 1 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(204);
  });

  it('returns 404 for missing student', async () => {
    const res = await DELETE(new Request('http://localhost/api/attendance?type=student', { method: 'DELETE', body: JSON.stringify({ id: 999 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(404);
  });
});
