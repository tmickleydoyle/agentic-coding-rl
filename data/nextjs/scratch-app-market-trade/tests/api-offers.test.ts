import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/offers/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded offers', async () => {
  const res = await GET(req('http://x/api/offers'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.offers.map((o: { id: string }) => o.id)).toEqual(['of1', 'of2', 'of3'])
})

it('GET filters by itemId', async () => {
  const res = await GET(req('http://x/api/offers?itemId=i2'))
  const body = await res.json()
  expect(body.offers.map((o: { id: string }) => o.id)).toEqual(['of1', 'of2'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/offers?status=pending'))
  const body = await res.json()
  expect(body.offers.map((o: { id: string }) => o.id)).toEqual(['of1', 'of3'])
})

it('GET combines itemId and status', async () => {
  const res = await GET(req('http://x/api/offers?itemId=i2&status=pending'))
  const body = await res.json()
  expect(body.offers.map((o: { id: string }) => o.id)).toEqual(['of1'])
})

it('POST creates an offer and returns 201', async () => {
  const res = await POST(
    req('http://x/api/offers', {
      method: 'POST',
      body: JSON.stringify({ itemId: 'i3', offeredBy: 'victor', give: 'Tripod' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.give).toBe('Tripod')
  expect(body.status).toBe('pending')
  expect(body.id).toBe('of4')
})

it('POST defaults offeredBy to unknown', async () => {
  const res = await POST(
    req('http://x/api/offers', { method: 'POST', body: JSON.stringify({ itemId: 'i3', give: 'Tripod' }) }),
  )
  const body = await res.json()
  expect(body.offeredBy).toBe('unknown')
})

it('POST without give returns 400', async () => {
  const res = await POST(req('http://x/api/offers', { method: 'POST', body: JSON.stringify({ itemId: 'i3' }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'give required' })
})

it('PUT sets an offer status', async () => {
  const res = await PUT(
    req('http://x/api/offers?id=of1', { method: 'PUT', body: JSON.stringify({ status: 'accepted' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('accepted')
})

it('PUT with an invalid status returns 400', async () => {
  const res = await PUT(
    req('http://x/api/offers?id=of1', { method: 'PUT', body: JSON.stringify({ status: 'maybe' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid status' })
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/offers?id=nope', { method: 'PUT', body: JSON.stringify({ status: 'accepted' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
