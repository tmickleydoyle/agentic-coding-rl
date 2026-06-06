import { describe, it, expect } from 'vitest'
import { GET } from '../reference/app/api/phone-format/route'

describe('GET /api/phone-format', () => {
  it('formats a plain 10-digit number', async () => {
    const res = await GET(new Request('http://x/api/phone-format?phone=5551234567'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.raw).toBe('5551234567')
    expect(body.formatted).toBe('(555) 123-4567')
  })

  it('strips dashes and formats', async () => {
    const res = await GET(new Request('http://x/api/phone-format?phone=555-123-4567'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.formatted).toBe('(555) 123-4567')
    expect(body.raw).toBe('555-123-4567')
  })

  it('strips parentheses and spaces', async () => {
    const res = await GET(new Request('http://x/api/phone-format?phone=(555) 123-4567'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.formatted).toBe('(555) 123-4567')
  })

  it('returns 400 when phone is missing', async () => {
    const res = await GET(new Request('http://x/api/phone-format'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('phone is required')
  })

  it('returns 400 for fewer than 10 digits', async () => {
    const res = await GET(new Request('http://x/api/phone-format?phone=12345'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('phone must contain exactly 10 digits')
  })

  it('returns 400 for more than 10 digits', async () => {
    const res = await GET(new Request('http://x/api/phone-format?phone=123456789012'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('phone must contain exactly 10 digits')
  })

  it('preserves raw input in response', async () => {
    const raw = '800.555.1234'
    const res = await GET(new Request(`http://x/api/phone-format?phone=${encodeURIComponent(raw)}`))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.raw).toBe(raw)
    expect(body.formatted).toBe('(800) 555-1234')
  })
})
