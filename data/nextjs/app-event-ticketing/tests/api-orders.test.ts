import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/orders/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded orders', async () => {
  const res = await GET(req('http://x/api/orders'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['o1'])
})

it('GET filters by eventId', async () => {
  const res = await GET(req('http://x/api/orders?eventId=e2'))
  const body = await res.json()
  expect(body.orders).toEqual([])
})

it('POST creates an order and returns 201 with computed total', async () => {
  const res = await POST(
    req('http://x/api/orders', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'e2', tierId: 't3', qty: 4, buyer: 'Linus' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('o2')
  expect(body.total).toBe(120)
})

it('POST with a missing field returns 400', async () => {
  const res = await POST(
    req('http://x/api/orders', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'e2', tierId: 't3', qty: 1 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid order' })
})

it('POST with a non-positive qty returns 400', async () => {
  const res = await POST(
    req('http://x/api/orders', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'e2', tierId: 't3', qty: 0, buyer: 'Zero' }),
    }),
  )
  expect(res.status).toBe(400)
})

it('POST with a non-integer qty returns 400', async () => {
  const res = await POST(
    req('http://x/api/orders', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'e2', tierId: 't3', qty: 1.5, buyer: 'Frac' }),
    }),
  )
  expect(res.status).toBe(400)
})

it('POST to an unknown tier returns 404', async () => {
  const res = await POST(
    req('http://x/api/orders', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'e1', tierId: 'tX', qty: 1, buyer: 'Ghost' }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST exceeding remaining capacity returns 409', async () => {
  const res = await POST(
    req('http://x/api/orders', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'e1', tierId: 't2', qty: 1, buyer: 'TooLate' }),
    }),
  )
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'sold out' })
})

it('POST increments the tier sold count', async () => {
  await POST(
    req('http://x/api/orders', {
      method: 'POST',
      body: JSON.stringify({ eventId: 'e2', tierId: 't3', qty: 5, buyer: 'Buyer' }),
    }),
  )
  const res = await GET(req('http://x/api/orders?eventId=e2'))
  const body = await res.json()
  expect(body.orders[0].qty).toBe(5)
})

it('DELETE removes an order and restores sold capacity', async () => {
  const del = await DELETE(req('http://x/api/orders?id=o1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/orders'))
  const body = await res.json()
  expect(body.orders).toEqual([])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/orders?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
