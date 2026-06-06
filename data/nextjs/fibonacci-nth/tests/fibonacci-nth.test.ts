import { describe, it, expect } from 'vitest'
import { GET } from '../reference/app/api/fibonacci-nth/route'

describe('fibonacci-nth GET', () => {
  it('returns 0 for n=0', async () => {
    const res = await GET(new Request('http://x/api/fibonacci-nth?n=0'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ n: 0, result: 0 })
  })

  it('returns 1 for n=1', async () => {
    const res = await GET(new Request('http://x/api/fibonacci-nth?n=1'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ n: 1, result: 1 })
  })

  it('returns 1 for n=2', async () => {
    const res = await GET(new Request('http://x/api/fibonacci-nth?n=2'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ n: 2, result: 1 })
  })

  it('returns 55 for n=10', async () => {
    const res = await GET(new Request('http://x/api/fibonacci-nth?n=10'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ n: 10, result: 55 })
  })

  it('returns 400 when n param is missing', async () => {
    const res = await GET(new Request('http://x/api/fibonacci-nth'))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'n query parameter is required' })
  })

  it('returns 422 for negative n', async () => {
    const res = await GET(new Request('http://x/api/fibonacci-nth?n=-1'))
    expect(res.status).toBe(422)
    expect(await res.json()).toEqual({ error: 'n must be a non-negative integer' })
  })

  it('returns 422 for non-integer n', async () => {
    const res = await GET(new Request('http://x/api/fibonacci-nth?n=abc'))
    expect(res.status).toBe(422)
    expect(await res.json()).toEqual({ error: 'n must be a non-negative integer' })
  })

  it('returns 21 for n=8', async () => {
    const res = await GET(new Request('http://x/api/fibonacci-nth?n=8'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ n: 8, result: 21 })
  })
})
