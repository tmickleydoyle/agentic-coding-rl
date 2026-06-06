import { describe, it, expect, beforeEach } from 'vitest';
import { __reset, getVisits, getMedications } from '../reference/lib/store';
import { GET, POST, DELETE } from '../reference/app/api/pets/route';

beforeEach(() => __reset());

describe('GET /api/pets', () => {
  it('returns seed pets', async () => {
    const res = await GET();
    const data = await res.json();
    expect(data.length).toBe(2);
  });
});

describe('POST /api/pets', () => {
  it('creates a pet', async () => {
    const req = new Request('http://localhost/api/pets', {
      method: 'POST',
      body: JSON.stringify({ name: 'Goldie', species: 'other', birthDate: '2022-01-01', weight: 0.1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe('Goldie');
  });

  it('returns 400 without name', async () => {
    const req = new Request('http://localhost/api/pets', {
      method: 'POST',
      body: JSON.stringify({ species: 'dog' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/pets', () => {
  it('deletes pet and cascades', async () => {
    const req = new Request('http://localhost/api/pets?id=pt1', { method: 'DELETE' });
    await DELETE(req);
    const listRes = await GET();
    const data = await listRes.json();
    expect(data.length).toBe(1);
    // Visits for pt1 should be removed
    const visits = getVisits();
    expect(visits.filter((v: { petId: string }) => v.petId === 'pt1').length).toBe(0);
    // Medications for pt1 should be removed
    const meds = getMedications();
    expect(meds.filter((m: { petId: string }) => m.petId === 'pt1').length).toBe(0);
  });

  it('returns 400 without id', async () => {
    const req = new Request('http://localhost/api/pets', { method: 'DELETE' });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
