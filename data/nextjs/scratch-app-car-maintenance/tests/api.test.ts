import { describe, it, expect, beforeEach } from 'vitest';
import { __reset, getServiceRecords, getReminders } from '../reference/lib/store';
import { GET, POST, PATCH, DELETE } from '../reference/app/api/vehicles/route';

beforeEach(() => __reset());

describe('GET /api/vehicles', () => {
  it('returns seed vehicles', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.length).toBe(2);
  });
});

describe('POST /api/vehicles', () => {
  it('creates a vehicle', async () => {
    const req = new Request('http://localhost/api/vehicles', {
      method: 'POST',
      body: JSON.stringify({ make: 'Nissan', model: 'Altima', year: 2021, mileage: 10000 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.make).toBe('Nissan');
  });

  it('returns 400 without make', async () => {
    const req = new Request('http://localhost/api/vehicles', {
      method: 'POST',
      body: JSON.stringify({ model: 'Altima', year: 2021 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/vehicles', () => {
  it('updates mileage', async () => {
    const req = new Request('http://localhost/api/vehicles?id=v1', {
      method: 'PATCH',
      body: JSON.stringify({ mileage: 50000 }),
    });
    await PATCH(req);
    const listRes = await GET();
    const data = await listRes.json();
    const v1 = data.find((v: { id: string }) => v.id === 'v1');
    expect(v1.mileage).toBe(50000);
  });
});

describe('DELETE /api/vehicles', () => {
  it('deletes vehicle and cascades', async () => {
    const req = new Request('http://localhost/api/vehicles?id=v1', { method: 'DELETE' });
    await DELETE(req);
    const listRes = await GET();
    const data = await listRes.json();
    expect(data.length).toBe(1);
    const sr = getServiceRecords();
    expect(sr.filter((s: { vehicleId: string }) => s.vehicleId === 'v1').length).toBe(0);
    const rem = getReminders();
    expect(rem.filter((r: { vehicleId: string }) => r.vehicleId === 'v1').length).toBe(0);
  });

  it('returns 400 without id', async () => {
    const req = new Request('http://localhost/api/vehicles', { method: 'DELETE' });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
