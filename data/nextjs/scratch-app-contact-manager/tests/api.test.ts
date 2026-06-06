import { describe, it, expect, beforeEach } from 'vitest';
import { __reset } from '../lib/store';
import { GET, POST, DELETE } from '../app/api/contacts/route';

beforeEach(() => { __reset(); });

describe('GET /api/contacts', () => {
  it('returns 4 seed contacts', async () => {
    const res = await GET(new Request('http://localhost/api/contacts'));
    const data = await res.json();
    expect(data.length).toBe(4);
  });

  it('searches with ?q=alice', async () => {
    const res = await GET(new Request('http://localhost/api/contacts?q=alice'));
    const data = await res.json();
    expect(data.length).toBe(1);
    expect(data[0].name).toBe('Alice Smith');
  });

  it('empty ?q= returns all', async () => {
    const res = await GET(new Request('http://localhost/api/contacts?q='));
    const data = await res.json();
    expect(data.length).toBe(4);
  });
});

describe('POST /api/contacts', () => {
  it('adds valid contact', async () => {
    const req = new Request('http://localhost/api/contacts', {
      method: 'POST',
      body: JSON.stringify({ name: 'Frank', email: 'frank@test.com', phone: '', group: 'Friends' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it('rejects invalid email', async () => {
    const req = new Request('http://localhost/api/contacts', {
      method: 'POST',
      body: JSON.stringify({ name: 'X', email: 'notvalid', phone: '', group: 'Work' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/contacts', () => {
  it('deletes existing contact', async () => {
    const res = await DELETE(new Request('http://localhost/api/contacts?id=ct1', { method: 'DELETE' }));
    expect(res.status).toBe(200);
  });

  it('returns 404 for unknown id', async () => {
    const res = await DELETE(new Request('http://localhost/api/contacts?id=x99', { method: 'DELETE' }));
    expect(res.status).toBe(404);
  });

  it('returns 400 when no id', async () => {
    const res = await DELETE(new Request('http://localhost/api/contacts', { method: 'DELETE' }));
    expect(res.status).toBe(400);
  });
});
