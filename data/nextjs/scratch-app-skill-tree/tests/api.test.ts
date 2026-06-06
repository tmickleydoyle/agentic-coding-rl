import { describe, it, expect, beforeEach } from 'vitest';
import { GET, PATCH } from '../app/api/skills/route';
import { __reset } from '../lib/store';

beforeEach(() => { __reset(); });

describe('GET /api/skills', () => {
  it('returns skills, paths, progress', async () => {
    const res = await GET(new Request('http://localhost/api/skills'));
    const data = await res.json();
    expect(data.skills).toHaveLength(6);
    expect(data.paths).toHaveLength(2);
    expect(data.progress).toHaveLength(6);
  });
});

describe('PATCH /api/skills (progress)', () => {
  it('updates skill status', async () => {
    const res = await PATCH(new Request('http://localhost/api/skills?type=progress', { method: 'PATCH', body: JSON.stringify({ skillId: 6, status: 'in_progress' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.ok).toBe(true);
    const p = await res.json();
    expect(p.status).toBe('in_progress');
  });

  it('returns 400 for completing locked skill', async () => {
    const res = await PATCH(new Request('http://localhost/api/skills?type=progress', { method: 'PATCH', body: JSON.stringify({ skillId: 4, status: 'completed' }), headers: { 'Content-Type': 'application/json' } }));
    expect(res.status).toBe(400);
  });

  it('auto-unlocks dependent skills on completion', async () => {
    // Complete skill 3 (JS Fundamentals) - should unlock 4 (React) and 5 (Node.js)
    await PATCH(new Request('http://localhost/api/skills?type=progress', { method: 'PATCH', body: JSON.stringify({ skillId: 3, status: 'completed' }), headers: { 'Content-Type': 'application/json' } }));
    const getRes = await GET(new Request('http://localhost/api/skills'));
    const data = await getRes.json();
    const skill4Progress = data.progress.find((p: { skillId: number; status: string }) => p.skillId === 4);
    expect(skill4Progress.status).toBe('available');
  });
});
