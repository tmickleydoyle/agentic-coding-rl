import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/products/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded products', async () => {
  const res = await GET(req('http://x/api/products'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.products.map((p: { id: string }) => p.id)).toEqual(['p1', 'p2', 'p3'])
})

it('GET ?inStock=true returns only stocked products', async () => {
  await POST(req('http://x/api/products', { method: 'POST', body: JSON.stringify({ name: 'Sold out', stock: 0 }) }))
  const res = await GET(req('http://x/api/products?inStock=true'))
  const body = await res.json()
  expect(body.products.map((p: { id: string }) => p.id)).toEqual(['p1', 'p2', 'p3'])
})

it('POST creates a product and returns 201', async () => {
  const res = await POST(
    req('http://x/api/products', { method: 'POST', body: JSON.stringify({ name: 'Cap', price: 15, stock: 9 }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Cap')
  expect(body.price).toBe(15)
  expect(body.id).toBe('p4')
})

it('POST applies price/stock defaults', async () => {
  const res = await POST(req('http://x/api/products', { method: 'POST', body: JSON.stringify({ name: 'Free' }) }))
  const body = await res.json()
  expect(body.price).toBe(0)
  expect(body.stock).toBe(0)
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/products', { method: 'POST', body: JSON.stringify({ price: 5 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})
