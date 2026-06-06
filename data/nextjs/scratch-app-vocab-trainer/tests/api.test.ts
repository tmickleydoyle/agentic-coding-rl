import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../reference/app/api/words/route';
import { __reset } from '../reference/lib/store';

beforeEach(() => { __reset(); });

describe('API /api/words', () => {
  it('GET returns 5 seed words', async () => {
    const res = GET();
    const data = await res.json();
    expect(data.words).toHaveLength(5);
  });

  it('POST creates a word', async () => {
    const req = new Request('http://localhost/api/words', {
      method: 'POST',
      body: JSON.stringify({ term: 'Verbose', definition: 'Using many words', category: 'adjective' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.word.term).toBe('Verbose');
  });

  it('POST rejects empty term', async () => {
    const req = new Request('http://localhost/api/words', {
      method: 'POST',
      body: JSON.stringify({ term: '', definition: 'def', category: 'noun' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('POST rejects duplicate', async () => {
    const req = new Request('http://localhost/api/words', {
      method: 'POST',
      body: JSON.stringify({ term: 'Ephemeral', definition: 'dup', category: 'adj' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('DELETE removes a word', async () => {
    const req = new Request('http://localhost/api/words?id=w1');
    const res = DELETE(req);
    expect((await res.json()).ok).toBe(true);
    const listRes = GET();
    const data = await listRes.json();
    expect(data.words).toHaveLength(4);
  });

  it('GET reflects added words', async () => {
    const req = new Request('http://localhost/api/words', {
      method: 'POST',
      body: JSON.stringify({ term: 'New', definition: 'A new word', category: 'noun' }),
    });
    await POST(req);
    const res = GET();
    const data = await res.json();
    expect(data.words).toHaveLength(6);
  });
});
