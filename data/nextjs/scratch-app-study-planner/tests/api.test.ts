import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../reference/app/api/sessions/route';
import { __reset } from '../reference/lib/store';

beforeEach(() => { __reset(); });

describe('API /api/sessions', () => {
  it('GET returns seed sessions', async () => {
    const res = GET();
    const data = await res.json();
    expect(data.sessions).toHaveLength(2);
  });

  it('POST creates a session', async () => {
    const req = new Request('http://localhost/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ subjectId: 's1', date: '2024-02-01', durationMinutes: 60, notes: 'Test' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.session.durationMinutes).toBe(60);
  });

  it('POST rejects non-positive duration', async () => {
    const req = new Request('http://localhost/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ subjectId: 's1', date: '2024-02-01', durationMinutes: 0, notes: '' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('DELETE removes a session', async () => {
    const req = new Request('http://localhost/api/sessions?id=ss1', { method: 'DELETE' });
    const res = DELETE(req);
    const data = await res.json();
    expect(data.ok).toBe(true);
    const listRes = GET();
    const listData = await listRes.json();
    expect(listData.sessions).toHaveLength(1);
  });

  it('GET reflects added sessions', async () => {
    const req = new Request('http://localhost/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ subjectId: 's2', date: '2024-02-02', durationMinutes: 20, notes: '' }),
    });
    await POST(req);
    const res = GET();
    const data = await res.json();
    expect(data.sessions).toHaveLength(3);
  });

  it('POST returns session with id', async () => {
    const req = new Request('http://localhost/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ subjectId: 's1', date: '2024-02-03', durationMinutes: 30, notes: 'note' }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.session.id).toBeTruthy();
  });
});
