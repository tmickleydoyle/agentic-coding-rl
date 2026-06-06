import { describe, it, expect } from 'vitest'
import { GET } from '../reference/app/api/luhn-check/route'

describe('GET /api/luhn-check', () => {
  it('returns valid=true for a valid card number', async () => {
    const res = await GET(new Request('http://x/api/luhn-check?number=4532015112830366'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ valid: true })
  })

  it('returns valid=false for an invalid card number', async () => {
    const res = await GET(new Request('http://x/api/luhn-check?number=1234567890123456'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ valid: false })
  })

  it('strips spaces and validates', async () => {
    const res = await GET(new Request('http://x/api/luhn-check?number=4532+0151+1283+0366'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ valid: true })
  })

  it('returns 400 when number is missing', async () => {
    const res = await GET(new Request('http://x/api/luhn-check'))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'number is required' })
  })

  it('returns 400 when number contains non-digit characters', async () => {
    const res = await GET(new Request('http://x/api/luhn-check?number=4532abc'))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'number must contain only digits' })
  })

  it('validates another known valid number', async () => {
    const res = await GET(new Request('http://x/api/luhn-check?number=79927398713'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ valid: true })
  })

  it('validates a known invalid number', async () => {
    const res = await GET(new Request('http://x/api/luhn-check?number=79927398714'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ valid: false })
  })
})
