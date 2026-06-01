import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/properties/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded properties', async () => {
  const res = await GET(req('http://x/api/properties'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.properties.map((p: { id: string }) => p.id)).toEqual(['p1', 'p2', 'p3'])
})

it('GET by id returns a single property', async () => {
  const res = await GET(req('http://x/api/properties?id=p2'))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.address).toBe('500 Pine Ave')
  expect(body.price).toBe(320000)
})

it('GET by unknown id returns 404', async () => {
  const res = await GET(req('http://x/api/properties?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST creates a property and returns 201', async () => {
  const res = await POST(
    req('http://x/api/properties', {
      method: 'POST',
      body: JSON.stringify({ address: '9 New Way', price: 275000 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.address).toBe('9 New Way')
  expect(body.price).toBe(275000)
  expect(body.id).toBe('p4')
})

it('POST without an address returns 400', async () => {
  const res = await POST(
    req('http://x/api/properties', { method: 'POST', body: JSON.stringify({ price: 100 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'address required' })
})

it('a created property then appears in GET', async () => {
  await POST(
    req('http://x/api/properties', { method: 'POST', body: JSON.stringify({ address: '1 Added St' }) }),
  )
  const res = await GET(req('http://x/api/properties'))
  const body = await res.json()
  expect(body.properties.map((p: { address: string }) => p.address)).toContain('1 Added St')
})

it('DELETE removes a property', async () => {
  const del = await DELETE(req('http://x/api/properties?id=p1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/properties'))
  const body = await res.json()
  expect(body.properties.map((p: { id: string }) => p.id)).toEqual(['p2', 'p3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/properties?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
