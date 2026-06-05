import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/lists/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists trips with percent packed', async () => {
  const res = await GET(req('http://x/api/lists'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.trips.map((t: { id: string }) => t.id)).toEqual(['tr1', 'tr2'])
  const tr1 = body.trips.find((t: { id: string }) => t.id === 'tr1')
  expect(tr1.percent).toBe(33)
})

it('GET by tripId returns the trip, items and percent', async () => {
  const res = await GET(req('http://x/api/lists?tripId=tr1'))
  const body = await res.json()
  expect(body.trip.id).toBe('tr1')
  expect(body.items.map((i: { id: string }) => i.id)).toEqual(['i1', 'i2', 'i3'])
  expect(body.percent).toBe(33)
})

it('GET by unknown tripId returns 404', async () => {
  const res = await GET(req('http://x/api/lists?tripId=nope'))
  expect(res.status).toBe(404)
})

it('POST creates an item and returns 201', async () => {
  const res = await POST(
    req('http://x/api/lists', {
      method: 'POST',
      body: JSON.stringify({ tripId: 'tr1', name: 'Towel', category: 'other' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('i5')
  expect(body.packed).toBe(false)
  expect(body.category).toBe('other')
})

it('POST falls back to other for an unknown category', async () => {
  const res = await POST(
    req('http://x/api/lists', {
      method: 'POST',
      body: JSON.stringify({ tripId: 'tr1', name: 'Thing', category: 'bogus' }),
    }),
  )
  const body = await res.json()
  expect(body.category).toBe('other')
})

it('POST for a missing trip returns 404', async () => {
  const res = await POST(
    req('http://x/api/lists', {
      method: 'POST',
      body: JSON.stringify({ tripId: 'nope', name: 'x' }),
    }),
  )
  expect(res.status).toBe(404)
})

it('POST with blank name returns 400', async () => {
  const res = await POST(
    req('http://x/api/lists', {
      method: 'POST',
      body: JSON.stringify({ tripId: 'tr1', name: '  ' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('PUT toggles packed when no explicit value given', async () => {
  const res = await PUT(req('http://x/api/lists?id=i2', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.packed).toBe(true)
})

it('PUT sets packed explicitly', async () => {
  const res = await PUT(
    req('http://x/api/lists?id=i1', { method: 'PUT', body: JSON.stringify({ packed: false }) }),
  )
  const body = await res.json()
  expect(body.packed).toBe(false)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/lists?id=nope', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(404)
})

it('DELETE removes an item', async () => {
  const del = await DELETE(req('http://x/api/lists?id=i1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/lists?tripId=tr1'))
  const body = await res.json()
  expect(body.items.map((i: { id: string }) => i.id)).toEqual(['i2', 'i3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/lists?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
})
