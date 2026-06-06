import { describe, it, expect } from 'vitest'
import { GET } from '../reference/app/api/title-case/route'

describe('GET /api/title-case', () => {
  it('capitalizes each word in a two-word sentence', async () => {
    const res = await GET(new Request('http://x/api/title-case?text=hello+world'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 'Hello World' })
  })

  it('lowercases uppercase words before capitalizing', async () => {
    const res = await GET(new Request('http://x/api/title-case?text=the+QUICK+brown+FOX'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 'The Quick Brown Fox' })
  })

  it('handles single word', async () => {
    const res = await GET(new Request('http://x/api/title-case?text=typescript'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 'Typescript' })
  })

  it('returns 400 when text is missing', async () => {
    const res = await GET(new Request('http://x/api/title-case'))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'text is required' })
  })

  it('returns 400 when text is empty string', async () => {
    const res = await GET(new Request('http://x/api/title-case?text='))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'text is required' })
  })

  it('handles already title-cased input', async () => {
    const res = await GET(new Request('http://x/api/title-case?text=Hello+World'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 'Hello World' })
  })

  it('returns content-type application/json', async () => {
    const res = await GET(new Request('http://x/api/title-case?text=test'))
    expect(res.headers.get('content-type')).toBe('application/json')
  })
})
