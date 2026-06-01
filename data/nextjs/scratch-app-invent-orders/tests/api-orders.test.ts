import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/orders/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded orders', async () => {
  const res = await GET(req('http://x/api/orders'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['po1', 'po2', 'po3'])
})

it('GET filters by supplier', async () => {
  const res = await GET(req('http://x/api/orders?supplier=Acme'))
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['po1', 'po2'])
})

it('POST creates an order and returns 201', async () => {
  const res = await POST(
    req('http://x/api/orders', {
      method: 'POST',
      body: JSON.stringify({ supplier: 'Initech', item: 'Cables', ordered: 75 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.supplier).toBe('Initech')
  expect(body.ordered).toBe(75)
  expect(body.received).toBe(0)
  expect(body.id).toBe('po4')
})

it('POST without a supplier returns 400', async () => {
  const res = await POST(
    req('http://x/api/orders', {
      method: 'POST',
      body: JSON.stringify({ item: 'Cables', ordered: 5 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'supplier required' })
})

it('POST with a non-positive ordered returns 400', async () => {
  const res = await POST(
    req('http://x/api/orders', {
      method: 'POST',
      body: JSON.stringify({ supplier: 'X', item: 'Y', ordered: 0 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'ordered invalid' })
})

it('PUT receive increments received and clamps at ordered', async () => {
  const res = await PUT(
    req('http://x/api/orders?id=po2', {
      method: 'PUT',
      body: JSON.stringify({ qty: 1000 }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.received).toBe(50)
})

it('PUT receive with a non-positive qty returns 400', async () => {
  const res = await PUT(
    req('http://x/api/orders?id=po2', {
      method: 'PUT',
      body: JSON.stringify({ qty: 0 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'qty invalid' })
})

it('PUT cancel marks the order cancelled', async () => {
  const res = await PUT(req('http://x/api/orders?id=po3&action=cancel', { method: 'PUT' }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.cancelled).toBe(true)
})

it('PUT receive on a cancelled order returns 409', async () => {
  await PUT(req('http://x/api/orders?id=po3&action=cancel', { method: 'PUT' }))
  const res = await PUT(
    req('http://x/api/orders?id=po3', { method: 'PUT', body: JSON.stringify({ qty: 5 }) }),
  )
  expect(res.status).toBe(409)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/orders?id=nope', { method: 'PUT', body: JSON.stringify({ qty: 1 }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
