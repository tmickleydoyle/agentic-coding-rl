import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../app/api/classes/route';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('GET /api/classes', () => {
  it('returns classroom, students, assignments', async () => {
    const res = await GET(new Request('http://localhost/api/classes'));
    const data = await res.json();
    expect(data.classroom.name).toBe('Math 101');
    expect(data.students).toHaveLength(4);
    expect(data.assignments).toHaveLength(2);
  });
});

describe('POST /api/classes (student)', () => {
  it('adds a student', async () => {
    const res = await POST(new Request('http://localhost/api/classes', { method: 'POST', body: JSON.stringify({ name: 'Eve Taylor' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(201);
    const student = await res.json();
    expect(student.name).toBe('Eve Taylor');
    expect(student.id).toBe(5);
  });

  it('returns 400 for empty name', async () => {
    const res = await POST(new Request('http://localhost/api/classes', { method: 'POST', body: JSON.stringify({ name: '' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/classes (assignment)', () => {
  it('adds an assignment', async () => {
    const res = await POST(new Request('http://localhost/api/classes?type=assignment', { method: 'POST', body: JSON.stringify({ name: 'Project 1', dueDate: '2024-03-01' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(201);
    const assignment = await res.json();
    expect(assignment.name).toBe('Project 1');
  });
});

describe('DELETE /api/classes', () => {
  it('removes a student', async () => {
    const res = await DELETE(new Request('http://localhost/api/classes', { method: 'DELETE', body: JSON.stringify({ id: 1 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(204);
  });

  it('returns 404 for missing student', async () => {
    const res = await DELETE(new Request('http://localhost/api/classes', { method: 'DELETE', body: JSON.stringify({ id: 999 }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(404);
  });
});
