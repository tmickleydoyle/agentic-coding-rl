import { describe, it, expect } from 'vitest'
import { GET } from '../reference/app/api/word-reverse/route'

describe('GET /api/word-reverse', () => {
  it('reverses each word in a two-word sentence', async () => {
    const res = await GET(new Request('http://x/api/word-reverse?sentence=hello+world'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 'olleh dlrow' })
  })

  it('reverses a single word', async () => {
    const res = await GET(new Request('http://x/api/word-reverse?sentence=abc'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 'cba' })
  })

  it('reverses multiple words', async () => {
    const res = await GET(new Request('http://x/api/word-reverse?sentence=the+quick+brown'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 'eht kciuq nworb' })
  })

  it('returns 400 when sentence is missing', async () => {
    const res = await GET(new Request('http://x/api/word-reverse'))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'sentence is required' })
  })

  it('returns 400 when sentence is empty string', async () => {
    const res = await GET(new Request('http://x/api/word-reverse?sentence='))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'sentence is required' })
  })

  it('handles a single character word', async () => {
    const res = await GET(new Request('http://x/api/word-reverse?sentence=a'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 'a' })
  })

  it('returns content-type application/json', async () => {
    const res = await GET(new Request('http://x/api/word-reverse?sentence=hi'))
    expect(res.headers.get('content-type')).toBe('application/json')
  })
})
