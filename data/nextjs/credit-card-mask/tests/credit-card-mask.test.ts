import { describe, it, expect } from 'vitest'
import { GET } from '../reference/app/api/credit-card-mask/route'

describe('GET /api/credit-card-mask', () => {
  it('masks a plain 16-digit number', async () => {
    const res = await GET(new Request('http://x/api/credit-card-mask?number=4111111111111111'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.masked).toBe('**** **** **** 1111')
    expect(body.last4).toBe('1111')
  })

  it('strips dashes before masking', async () => {
    const res = await GET(new Request('http://x/api/credit-card-mask?number=4111-1111-1111-1234'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.masked).toBe('**** **** **** 1234')
    expect(body.last4).toBe('1234')
  })

  it('strips spaces before masking', async () => {
    const res = await GET(new Request('http://x/api/credit-card-mask?number=4111+1111+1111+5678'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.masked).toBe('**** **** **** 5678')
    expect(body.last4).toBe('5678')
  })

  it('returns 400 when number is missing', async () => {
    const res = await GET(new Request('http://x/api/credit-card-mask'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('number is required')
  })

  it('returns 400 for fewer than 16 digits', async () => {
    const res = await GET(new Request('http://x/api/credit-card-mask?number=411111111111'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('card number must contain exactly 16 digits')
  })

  it('returns 400 for more than 16 digits', async () => {
    const res = await GET(new Request('http://x/api/credit-card-mask?number=41111111111111111'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('card number must contain exactly 16 digits')
  })

  it('masked format always starts with **** **** ****', async () => {
    const res = await GET(new Request('http://x/api/credit-card-mask?number=5500005555555559'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.masked.startsWith('**** **** ****')).toBe(true)
  })
})
