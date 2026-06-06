import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../reference/app/api/entries/route';
import { __reset } from '../reference/lib/store';

beforeEach(() => { __reset(); });

describe('API /api/entries', () => {
  it('GET returns 3 seed entries', async () => {
    const res = GET();
    const data = await res.json();
    expect(data.entries).toHaveLength(3);
  });

  it('POST creates an entry', async () => {
    const req = new Request('http://localhost/api/entries', {
      method: 'POST',
      body: JSON.stringify({ date: '2024-01-10', temperature: 18, condition: 'sunny', humidity: 55, notes: 'Nice day' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.entry.date).toBe('2024-01-10');
  });

  it('POST rejects duplicate date', async () => {
    const req = new Request('http://localhost/api/entries', {
      method: 'POST',
      body: JSON.stringify({ date: '2024-01-01', temperature: 20, condition: 'cloudy', humidity: 60, notes: '' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('POST rejects invalid humidity', async () => {
    const req = new Request('http://localhost/api/entries', {
      method: 'POST',
      body: JSON.stringify({ date: '2024-02-01', temperature: 15, condition: 'rainy', humidity: 150, notes: '' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('DELETE removes an entry', async () => {
    const req = new Request('http://localhost/api/entries?id=w1');
    const res = DELETE(req);
    expect((await res.json()).ok).toBe(true);
    const data = await (GET()).json();
    expect(data.entries).toHaveLength(2);
  });

  it('GET reflects additions', async () => {
    const req = new Request('http://localhost/api/entries', {
      method: 'POST',
      body: JSON.stringify({ date: '2024-01-20', temperature: 5, condition: 'snowy', humidity: 80, notes: '' }),
    });
    await POST(req);
    const data = await (GET()).json();
    expect(data.entries).toHaveLength(4);
  });
});
