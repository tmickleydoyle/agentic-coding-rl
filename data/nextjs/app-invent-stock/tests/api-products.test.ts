import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/products/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded products', async () => {
  const res = await GET(req('http://x/api/products'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.products.map((p: { id: string }) => p.id)).toEqual(['p1', 'p2', 'p3'])
})

it('GET filters to low stock with ?low=true', async () => {
  const res = await GET(req('http://x/api/products?low=true'))
  const body = await res.json()
  expect(body.products.map((p: { id: string }) => p.id)).toEqual(['p2', 'p3'])
})

it('POST creates a product and returns 201', async () => {
  const res = await POST(
    req('http://x/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Bolt', qty: 100, reorderPoint: 20 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Bolt')
  expect(body.qty).toBe(100)
  expect(body.reorderPoint).toBe(20)
  expect(body.id).toBe('p4')
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/products', {
      method: 'POST',
      body: JSON.stringify({ qty: 1, reorderPoint: 1 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST with a negative qty returns 400', async () => {
  const res = await POST(
    req('http://x/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Bad', qty: -1, reorderPoint: 1 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'qty invalid' })
})

it('POST with a negative reorderPoint returns 400', async () => {
  const res = await POST(
    req('http://x/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Bad', qty: 1, reorderPoint: -3 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'reorderPoint invalid' })
})

it('PUT adjusts a product quantity by a positive delta', async () => {
  const res = await PUT(
    req('http://x/api/products?id=p2', {
      method: 'PUT',
      body: JSON.stringify({ delta: 7 }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('p2')
  expect(body.qty).toBe(12)
})

it('PUT clamps quantity at zero on a large negative delta', async () => {
  const res = await PUT(
    req('http://x/api/products?id=p2', {
      method: 'PUT',
      body: JSON.stringify({ delta: -50 }),
    }),
  )
  const body = await res.json()
  expect(body.qty).toBe(0)
})

it('PUT with a non-numeric delta returns 400', async () => {
  const res = await PUT(
    req('http://x/api/products?id=p2', {
      method: 'PUT',
      body: JSON.stringify({ delta: 'lots' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'delta invalid' })
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/products?id=nope', {
      method: 'PUT',
      body: JSON.stringify({ delta: 1 }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('a created product then appears in GET', async () => {
  await POST(
    req('http://x/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Bolt', qty: 5, reorderPoint: 2 }),
    }),
  )
  const res = await GET(req('http://x/api/products'))
  const body = await res.json()
  expect(body.products.map((p: { name: string }) => p.name)).toContain('Bolt')
})
