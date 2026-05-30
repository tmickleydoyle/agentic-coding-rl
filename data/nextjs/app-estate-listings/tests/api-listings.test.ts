import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/listings/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded properties', async () => {
  const res = await GET(req('http://x/api/listings'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.properties.map((p: { id: string }) => p.id)).toEqual(['h1', 'h2', 'h3', 'h4'])
})

it('GET filters by type', async () => {
  const res = await GET(req('http://x/api/listings?type=house'))
  const body = await res.json()
  expect(body.properties.map((p: { id: string }) => p.id)).toEqual(['h1', 'h4'])
})

it('GET filters by minBeds', async () => {
  const res = await GET(req('http://x/api/listings?minBeds=4'))
  const body = await res.json()
  expect(body.properties.map((p: { id: string }) => p.id)).toEqual(['h3', 'h4'])
})

it('GET filters by maxPrice', async () => {
  const res = await GET(req('http://x/api/listings?maxPrice=400000'))
  const body = await res.json()
  expect(body.properties.map((p: { id: string }) => p.id)).toEqual(['h2'])
})

it('GET combines filters with AND', async () => {
  const res = await GET(req('http://x/api/listings?type=house&minBeds=4'))
  const body = await res.json()
  expect(body.properties.map((p: { id: string }) => p.id)).toEqual(['h4'])
})

it('GET by id returns a single property', async () => {
  const res = await GET(req('http://x/api/listings?id=h2'))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.address).toBe('500 Pine Ave')
})

it('GET by unknown id returns 404', async () => {
  const res = await GET(req('http://x/api/listings?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST creates a property and returns 201', async () => {
  const res = await POST(
    req('http://x/api/listings', {
      method: 'POST',
      body: JSON.stringify({ address: '9 New Way', type: 'condo', price: 250000, beds: 1, baths: 1 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.address).toBe('9 New Way')
  expect(body.type).toBe('condo')
  expect(body.id).toBe('h5')
})

it('POST without an address returns 400', async () => {
  const res = await POST(
    req('http://x/api/listings', { method: 'POST', body: JSON.stringify({ price: 100 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'address required' })
})

it('a created property then appears in GET', async () => {
  await POST(
    req('http://x/api/listings', { method: 'POST', body: JSON.stringify({ address: '1 Added St' }) }),
  )
  const res = await GET(req('http://x/api/listings'))
  const body = await res.json()
  expect(body.properties.map((p: { address: string }) => p.address)).toContain('1 Added St')
})

it('DELETE removes a property', async () => {
  const del = await DELETE(req('http://x/api/listings?id=h1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/listings'))
  const body = await res.json()
  expect(body.properties.map((p: { id: string }) => p.id)).toEqual(['h2', 'h3', 'h4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/listings?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
