import { describe, it, expect } from 'vitest'
import { GET } from '../reference/app/api/clamp-value/route'

describe('GET /api/clamp-value', () => {
  it('returns value unchanged when within range', async () => {
    const res = await GET(new Request('http://x/api/clamp-value?value=5&min=1&max=10'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 5 })
  })

  it('clamps to max when value exceeds max', async () => {
    const res = await GET(new Request('http://x/api/clamp-value?value=15&min=1&max=10'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 10 })
  })

  it('clamps to min when value is below min', async () => {
    const res = await GET(new Request('http://x/api/clamp-value?value=-3&min=0&max=100'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 0 })
  })

  it('returns 400 when min > max', async () => {
    const res = await GET(new Request('http://x/api/clamp-value?value=5&min=10&max=1'))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'min must be <= max' })
  })

  it('returns 400 when a parameter is missing', async () => {
    const res = await GET(new Request('http://x/api/clamp-value?value=5&min=1'))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'value, min, and max are required numbers' })
  })

  it('returns 400 when value is not a number', async () => {
    const res = await GET(new Request('http://x/api/clamp-value?value=abc&min=1&max=10'))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'value, min, and max are required numbers' })
  })

  it('handles float values', async () => {
    const res = await GET(new Request('http://x/api/clamp-value?value=3.7&min=1.5&max=5.5'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 3.7 })
  })
})
