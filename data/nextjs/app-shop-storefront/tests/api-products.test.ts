import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/products/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded products', async () => {
  const res = await GET(req('http://x/api/products'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.products.map((p: { id: string }) => p.id)).toEqual(['s1', 's2', 's3', 's4', 's5'])
})

it('GET filters by category', async () => {
  const res = await GET(req('http://x/api/products?category=office'))
  const body = await res.json()
  expect(body.products.map((p: { id: string }) => p.id)).toEqual(['s2', 's3'])
})

it('GET filters by maxPrice', async () => {
  const res = await GET(req('http://x/api/products?maxPrice=12'))
  const body = await res.json()
  expect(body.products.map((p: { id: string }) => p.id)).toEqual(['s1', 's3'])
})

it('GET combines category and maxPrice with AND', async () => {
  const res = await GET(req('http://x/api/products?category=kitchen&maxPrice=20'))
  const body = await res.json()
  expect(body.products.map((p: { id: string }) => p.id)).toEqual(['s1'])
})

it('POST creates a product and returns 201', async () => {
  const res = await POST(
    req('http://x/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Coaster', category: 'kitchen', price: 4 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Coaster')
  expect(body.category).toBe('kitchen')
  expect(body.price).toBe(4)
  expect(body.id).toBe('s6')
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/products', { method: 'POST', body: JSON.stringify({ price: 5 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST with a negative price returns 400', async () => {
  const res = await POST(
    req('http://x/api/products', { method: 'POST', body: JSON.stringify({ name: 'Bad', price: -3 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'price invalid' })
})

it('POST with a non-numeric price returns 400', async () => {
  const res = await POST(
    req('http://x/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Bad', price: 'free' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'price invalid' })
})

it('a created product then appears in GET', async () => {
  await POST(
    req('http://x/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Coaster', category: 'kitchen', price: 4 }),
    }),
  )
  const res = await GET(req('http://x/api/products'))
  const body = await res.json()
  expect(body.products.map((p: { name: string }) => p.name)).toContain('Coaster')
})

it('DELETE removes a product', async () => {
  const del = await DELETE(req('http://x/api/products?id=s1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/products'))
  const body = await res.json()
  expect(body.products.map((p: { id: string }) => p.id)).toEqual(['s2', 's3', 's4', 's5'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/products?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
