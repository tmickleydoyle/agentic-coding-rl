import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/coupons/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded coupons', async () => {
  const res = await GET(req('http://x/api/coupons'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.coupons.map((c: { code: string }) => c.code)).toEqual(['SAVE10', 'FLAT5', 'BIG20'])
})

it('GET filters by kind', async () => {
  const res = await GET(req('http://x/api/coupons?kind=fixed'))
  const body = await res.json()
  expect(body.coupons.map((c: { code: string }) => c.code)).toEqual(['FLAT5'])
})

it('GET validates a percent coupon against a subtotal', async () => {
  const res = await GET(req('http://x/api/coupons?code=SAVE10&subtotal=30'))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body).toEqual({ valid: true, discount: 3, total: 27, message: 'Coupon applied' })
})

it('GET reports a min-spend coupon as invalid below its threshold', async () => {
  const res = await GET(req('http://x/api/coupons?code=BIG20&subtotal=20'))
  const body = await res.json()
  expect(body.valid).toBe(false)
  expect(body.discount).toBe(0)
  expect(body.total).toBe(20)
  expect(body.message).toContain('Spend at least 50')
})

it('GET validation is case-insensitive on the code', async () => {
  const res = await GET(req('http://x/api/coupons?code=flat5&subtotal=10'))
  const body = await res.json()
  expect(body).toEqual({ valid: true, discount: 5, total: 5, message: 'Coupon applied' })
})

it('GET on an unknown code returns 404', async () => {
  const res = await GET(req('http://x/api/coupons?code=NOPE&subtotal=10'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST creates a coupon (uppercasing the code) and returns 201', async () => {
  const res = await POST(
    req('http://x/api/coupons', {
      method: 'POST',
      body: JSON.stringify({ code: 'spring', kind: 'percent', amount: 15 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.code).toBe('SPRING')
  expect(body.kind).toBe('percent')
  expect(body.amount).toBe(15)
  expect(body.minSpend).toBe(0)
})

it('POST without a code returns 400', async () => {
  const res = await POST(
    req('http://x/api/coupons', { method: 'POST', body: JSON.stringify({ kind: 'percent', amount: 5 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'code required' })
})

it('POST with an invalid kind returns 400', async () => {
  const res = await POST(
    req('http://x/api/coupons', {
      method: 'POST',
      body: JSON.stringify({ code: 'X', kind: 'bogus', amount: 5 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'kind invalid' })
})

it('POST with a negative amount returns 400', async () => {
  const res = await POST(
    req('http://x/api/coupons', {
      method: 'POST',
      body: JSON.stringify({ code: 'X', kind: 'fixed', amount: -1 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'amount invalid' })
})

it('POST with a duplicate code returns 409', async () => {
  const res = await POST(
    req('http://x/api/coupons', {
      method: 'POST',
      body: JSON.stringify({ code: 'save10', kind: 'percent', amount: 99 }),
    }),
  )
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'code exists' })
})

it('a created coupon then appears in GET', async () => {
  await POST(
    req('http://x/api/coupons', {
      method: 'POST',
      body: JSON.stringify({ code: 'spring', kind: 'percent', amount: 15 }),
    }),
  )
  const res = await GET(req('http://x/api/coupons'))
  const body = await res.json()
  expect(body.coupons.map((c: { code: string }) => c.code)).toContain('SPRING')
})
