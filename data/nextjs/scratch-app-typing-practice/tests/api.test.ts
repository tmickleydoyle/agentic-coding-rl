import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST } from '../reference/app/api/scores/route';
import { __reset } from '../reference/lib/store';

beforeEach(() => { __reset(); });

describe('API /api/scores', () => {
  it('GET returns 2 seed scores sorted by WPM desc', async () => {
    const res = GET();
    const data = await res.json();
    expect(data.scores).toHaveLength(2);
    expect(data.scores[0].wpm).toBeGreaterThanOrEqual(data.scores[1].wpm);
  });

  it('POST adds a score', async () => {
    const req = new Request('http://localhost/api/scores', {
      method: 'POST',
      body: JSON.stringify({ name: 'Carol', wpm: 80, accuracy: 99, date: '2024-02-01' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.score.name).toBe('Carol');
  });

  it('GET after POST includes new score', async () => {
    const req = new Request('http://localhost/api/scores', {
      method: 'POST',
      body: JSON.stringify({ name: 'Dave', wpm: 90, accuracy: 97, date: '2024-02-02' }),
    });
    await POST(req);
    const res = GET();
    const data = await res.json();
    expect(data.scores).toHaveLength(3);
    expect(data.scores[0].name).toBe('Dave');
  });

  it('GET returns scores sorted by wpm desc', async () => {
    const res = GET();
    const data = await res.json();
    expect(data.scores[0].wpm).toBe(72);
    expect(data.scores[1].wpm).toBe(55);
  });

  it('POST returns score with id', async () => {
    const req = new Request('http://localhost/api/scores', {
      method: 'POST',
      body: JSON.stringify({ name: 'Eve', wpm: 60, accuracy: 95, date: '2024-02-03' }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.score.id).toBeTruthy();
  });
});
