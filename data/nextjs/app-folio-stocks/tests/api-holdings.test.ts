import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/holdings/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded holdings', async () => {
  const res = await GET(req('http://x/api/holdings'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.holdings.map((h: { id: string }) => h.id)).toEqual(['h1', 'h2', 'h3'])
})

it('POST creates a holding and returns 201', async () => {
  const res = await POST(
    req('http://x/api/holdings', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'nvda', shares: 3, costBasis: 100, price: 120 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.symbol).toBe('NVDA')
  expect(body.shares).toBe(3)
  expect(body.price).toBe(120)
  expect(body.id).toBe('h4')
})

it('POST defaults price to costBasis when omitted', async () => {
  const res = await POST(
    req('http://x/api/holdings', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'AMD', shares: 2, costBasis: 80 }),
    }),
  )
  const body = await res.json()
  expect(body.price).toBe(80)
})

it('POST without a symbol returns 400', async () => {
  const res = await POST(
    req('http://x/api/holdings', { method: 'POST', body: JSON.stringify({ shares: 1, costBasis: 10 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'symbol required' })
})

it('POST with non-positive shares returns 400', async () => {
  const res = await POST(
    req('http://x/api/holdings', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'AMD', shares: 0, costBasis: 10 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'shares must be positive' })
})

it('POST with non-positive costBasis returns 400', async () => {
  const res = await POST(
    req('http://x/api/holdings', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'AMD', shares: 2, costBasis: -5 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'costBasis must be positive' })
})

it('DELETE removes a holding', async () => {
  const del = await DELETE(req('http://x/api/holdings?id=h1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/holdings'))
  const body = await res.json()
  expect(body.holdings.map((h: { id: string }) => h.id)).toEqual(['h2', 'h3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/holdings?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
