import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/orders/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded orders', async () => {
  const res = await GET(req('http://x/api/orders'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['o1', 'o2', 'o3'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/orders?status=placed'))
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['o3'])
})

it('POST creates an order and returns 201', async () => {
  const res = await POST(
    req('http://x/api/orders', { method: 'POST', body: JSON.stringify({ item: 'Coaster', total: 4 }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.item).toBe('Coaster')
  expect(body.total).toBe(4)
  expect(body.status).toBe('placed')
  expect(body.id).toBe('o4')
})

it('POST without an item returns 400', async () => {
  const res = await POST(
    req('http://x/api/orders', { method: 'POST', body: JSON.stringify({ total: 5 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'item required' })
})

it('POST with a negative total returns 400', async () => {
  const res = await POST(
    req('http://x/api/orders', { method: 'POST', body: JSON.stringify({ item: 'Bad', total: -2 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'total invalid' })
})

it('PUT sets an order status', async () => {
  const res = await PUT(
    req('http://x/api/orders?id=o3', { method: 'PUT', body: JSON.stringify({ status: 'shipped' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('o3')
  expect(body.status).toBe('shipped')
})

it('PUT with an invalid status returns 400', async () => {
  const res = await PUT(
    req('http://x/api/orders?id=o3', { method: 'PUT', body: JSON.stringify({ status: 'lost' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'status invalid' })
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/orders?id=nope', { method: 'PUT', body: JSON.stringify({ status: 'shipped' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('a created order then appears in GET', async () => {
  await POST(
    req('http://x/api/orders', { method: 'POST', body: JSON.stringify({ item: 'Coaster', total: 4 }) }),
  )
  const res = await GET(req('http://x/api/orders'))
  const body = await res.json()
  expect(body.orders.map((o: { item: string }) => o.item)).toContain('Coaster')
})
