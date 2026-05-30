import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/listings/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded listings', async () => {
  const res = await GET(req('http://x/api/listings'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.listings.map((l: { id: string }) => l.id)).toEqual(['l1', 'l2', 'l3'])
})

it('GET filters by category', async () => {
  const res = await GET(req('http://x/api/listings?category=furniture'))
  const body = await res.json()
  expect(body.listings.map((l: { id: string }) => l.id)).toEqual(['l2'])
})

it('GET filters by maxPrice', async () => {
  const res = await GET(req('http://x/api/listings?maxPrice=200'))
  const body = await res.json()
  expect(body.listings.map((l: { id: string }) => l.id)).toEqual(['l2'])
})

it('GET combines category and maxPrice', async () => {
  const res = await GET(req('http://x/api/listings?category=electronics&maxPrice=100'))
  const body = await res.json()
  expect(body.listings).toEqual([])
})

it('POST creates a listing and returns 201', async () => {
  const res = await POST(
    req('http://x/api/listings', {
      method: 'POST',
      body: JSON.stringify({ title: 'Sofa', category: 'furniture', price: 300, seller: 'dan' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('Sofa')
  expect(body.category).toBe('furniture')
  expect(body.price).toBe(300)
  expect(body.id).toBe('l4')
})

it('POST applies defaults for missing fields', async () => {
  const res = await POST(
    req('http://x/api/listings', { method: 'POST', body: JSON.stringify({ title: 'Mystery box' }) }),
  )
  const body = await res.json()
  expect(body.category).toBe('misc')
  expect(body.price).toBe(0)
  expect(body.seller).toBe('unknown')
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/listings', { method: 'POST', body: JSON.stringify({ price: 5 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('a created listing then appears in GET', async () => {
  await POST(req('http://x/api/listings', { method: 'POST', body: JSON.stringify({ title: 'Tent' }) }))
  const res = await GET(req('http://x/api/listings'))
  const body = await res.json()
  expect(body.listings.map((l: { title: string }) => l.title)).toContain('Tent')
})

it('DELETE removes a listing', async () => {
  const del = await DELETE(req('http://x/api/listings?id=l1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/listings'))
  const body = await res.json()
  expect(body.listings.map((l: { id: string }) => l.id)).toEqual(['l2', 'l3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/listings?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
