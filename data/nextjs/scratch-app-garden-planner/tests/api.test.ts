import { describe, it, expect, beforeEach } from 'vitest';
import { __reset } from '../reference/lib/store';
import { GET, POST, DELETE } from '../reference/app/api/plants/route';

beforeEach(() => __reset());

describe('GET /api/plants', () => {
  it('returns seed plants', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});

describe('POST /api/plants', () => {
  it('creates a plant', async () => {
    const req = new Request('http://localhost/api/plants', {
      method: 'POST',
      body: JSON.stringify({ name: 'Mint', type: 'herb', sunlight: 'partial', wateringFrequency: 'weekly' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe('Mint');
  });

  it('returns 400 when missing fields', async () => {
    const req = new Request('http://localhost/api/plants', {
      method: 'POST',
      body: JSON.stringify({ name: 'Mint' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/plants', () => {
  it('deletes a plant', async () => {
    const req = new Request('http://localhost/api/plants?id=pl1', { method: 'DELETE' });
    await DELETE(req);
    const listRes = await GET();
    const data = await listRes.json();
    expect(data.length).toBe(2);
  });

  it('returns 400 without id', async () => {
    const req = new Request('http://localhost/api/plants', { method: 'DELETE' });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });

  it('removes plant from beds when deleted', async () => {
    const { getBeds } = await import('../reference/lib/store');
    const req = new Request('http://localhost/api/plants?id=pl1', { method: 'DELETE' });
    await DELETE(req);
    const beds = getBeds();
    const b1 = beds.find(b => b.id === 'b1');
    expect(b1?.plantIds.includes('pl1')).toBe(false);
  });
});
