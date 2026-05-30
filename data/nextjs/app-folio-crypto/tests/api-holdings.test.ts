import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/holdings/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded coins', async () => {
  const res = await GET(req('http://x/api/holdings'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.coins.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2', 'c3'])
})

it('POST creates a coin and returns 201', async () => {
  const res = await POST(
    req('http://x/api/holdings', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'ada', amount: 100, price: 2, change24h: 8 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.symbol).toBe('ADA')
  expect(body.amount).toBe(100)
  expect(body.change24h).toBe(8)
  expect(body.id).toBe('c4')
})

it('POST defaults change24h to 0 when omitted', async () => {
  const res = await POST(
    req('http://x/api/holdings', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'DOT', amount: 10, price: 5 }),
    }),
  )
  const body = await res.json()
  expect(body.change24h).toBe(0)
})

it('POST without a symbol returns 400', async () => {
  const res = await POST(
    req('http://x/api/holdings', { method: 'POST', body: JSON.stringify({ amount: 1, price: 10 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'symbol required' })
})

it('POST with non-positive amount returns 400', async () => {
  const res = await POST(
    req('http://x/api/holdings', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'ADA', amount: 0, price: 10 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'amount must be positive' })
})

it('POST with non-positive price returns 400', async () => {
  const res = await POST(
    req('http://x/api/holdings', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'ADA', amount: 2, price: -1 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'price must be positive' })
})

it('DELETE removes a coin', async () => {
  const del = await DELETE(req('http://x/api/holdings?id=c1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/holdings'))
  const body = await res.json()
  expect(body.coins.map((c: { id: string }) => c.id)).toEqual(['c2', 'c3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/holdings?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
