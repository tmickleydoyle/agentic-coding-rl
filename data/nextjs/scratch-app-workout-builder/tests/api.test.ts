import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../reference/app/api/routines/route';
import { __reset } from '../reference/lib/store';

beforeEach(() => { __reset(); });

describe('API /api/routines', () => {
  it('GET returns seed routine', async () => {
    const res = GET();
    const data = await res.json();
    expect(data.routines).toHaveLength(1);
  });

  it('POST creates a routine', async () => {
    const req = new Request('http://localhost/api/routines', {
      method: 'POST',
      body: JSON.stringify({ name: 'Cardio Blast', exerciseIds: ['ex3'], estimatedMinutes: 30 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.routine.name).toBe('Cardio Blast');
  });

  it('POST rejects empty name', async () => {
    const req = new Request('http://localhost/api/routines', {
      method: 'POST',
      body: JSON.stringify({ name: '', exerciseIds: [], estimatedMinutes: 20 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('DELETE removes a routine', async () => {
    const req = new Request('http://localhost/api/routines?id=r1');
    const res = DELETE(req);
    expect((await res.json()).ok).toBe(true);
    const data = await (GET()).json();
    expect(data.routines).toHaveLength(0);
  });

  it('POST with empty exerciseIds is allowed', async () => {
    const req = new Request('http://localhost/api/routines', {
      method: 'POST',
      body: JSON.stringify({ name: 'Empty Routine', exerciseIds: [], estimatedMinutes: 0 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it('GET reflects additions', async () => {
    const req = new Request('http://localhost/api/routines', {
      method: 'POST',
      body: JSON.stringify({ name: 'New', exerciseIds: ['ex1'], estimatedMinutes: 15 }),
    });
    await POST(req);
    const data = await (GET()).json();
    expect(data.routines).toHaveLength(2);
  });
});
