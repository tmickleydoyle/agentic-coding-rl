import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/holdings/route'

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
      body: JSON.stringify({ symbol: 'reit', value: 2000, targetPercent: 10 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.symbol).toBe('REIT')
  expect(body.value).toBe(2000)
  expect(body.id).toBe('h4')
})

it('POST without a symbol returns 400', async () => {
  const res = await POST(
    req('http://x/api/holdings', { method: 'POST', body: JSON.stringify({ value: 1, targetPercent: 5 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'symbol required' })
})

it('POST with a non-positive value returns 400', async () => {
  const res = await POST(
    req('http://x/api/holdings', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'REIT', value: 0, targetPercent: 5 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'value must be positive' })
})

it('POST with a negative targetPercent returns 400', async () => {
  const res = await POST(
    req('http://x/api/holdings', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'REIT', value: 100, targetPercent: -5 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'targetPercent must be non-negative' })
})

it('PUT updates a holding target', async () => {
  const res = await PUT(
    req('http://x/api/holdings?id=h1', { method: 'PUT', body: JSON.stringify({ targetPercent: 40 }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('h1')
  expect(body.targetPercent).toBe(40)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/holdings?id=nope', { method: 'PUT', body: JSON.stringify({ targetPercent: 40 }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
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
