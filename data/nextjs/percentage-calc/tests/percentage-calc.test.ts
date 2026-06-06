import { describe, it, expect } from 'vitest'
import { GET } from '../reference/app/api/percentage-calc/route'

describe('GET /api/percentage-calc', () => {
  it('returns correct percentage with defaults', async () => {
    const res = await GET(new Request('http://x/api/percentage-calc?value=25&total=200'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.percentage).toBe(12.5)
    expect(body.value).toBe(25)
    expect(body.total).toBe(200)
    expect(body.decimals).toBe(2)
  })

  it('respects custom decimals parameter', async () => {
    const res = await GET(new Request('http://x/api/percentage-calc?value=1&total=3&decimals=4'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.percentage).toBe(33.3333)
    expect(body.decimals).toBe(4)
  })

  it('returns 400 when value is missing', async () => {
    const res = await GET(new Request('http://x/api/percentage-calc?total=100'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('value and total are required')
  })

  it('returns 400 when total is missing', async () => {
    const res = await GET(new Request('http://x/api/percentage-calc?value=50'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('value and total are required')
  })

  it('returns 400 when total is zero', async () => {
    const res = await GET(new Request('http://x/api/percentage-calc?value=10&total=0'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('total must not be zero')
  })

  it('returns 400 for non-numeric inputs', async () => {
    const res = await GET(new Request('http://x/api/percentage-calc?value=abc&total=100'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('value and total must be numbers')
  })

  it('calculates 100% correctly', async () => {
    const res = await GET(new Request('http://x/api/percentage-calc?value=50&total=50'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.percentage).toBe(100)
  })

  it('clamps decimals to max 10', async () => {
    const res = await GET(new Request('http://x/api/percentage-calc?value=1&total=3&decimals=15'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.decimals).toBe(10)
  })
})
