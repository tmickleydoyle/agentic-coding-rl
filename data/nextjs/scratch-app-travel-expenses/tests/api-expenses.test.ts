import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/expenses/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists trips with total', async () => {
  const res = await GET(req('http://x/api/expenses'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.trips.map((t: { id: string }) => t.id)).toEqual(['tr1', 'tr2'])
  const tr1 = body.trips.find((t: { id: string }) => t.id === 'tr1')
  expect(tr1.total).toBe(280)
})

it('GET by tripId returns the trip, expenses and total', async () => {
  const res = await GET(req('http://x/api/expenses?tripId=tr1'))
  const body = await res.json()
  expect(body.trip.id).toBe('tr1')
  expect(body.expenses.map((e: { id: string }) => e.id)).toEqual(['e1', 'e2', 'e3'])
  expect(body.total).toBe(280)
})

it('GET filters by category', async () => {
  const res = await GET(req('http://x/api/expenses?tripId=tr1&category=food'))
  const body = await res.json()
  expect(body.expenses.map((e: { id: string }) => e.id)).toEqual(['e2', 'e3'])
})

it('GET by unknown tripId returns 404', async () => {
  const res = await GET(req('http://x/api/expenses?tripId=nope'))
  expect(res.status).toBe(404)
})

it('POST creates an expense and returns 201', async () => {
  const res = await POST(
    req('http://x/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ tripId: 'tr2', day: 2, category: 'food', amount: 22, note: 'Tapas' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('e5')
  expect(body.amount).toBe(22)
  expect(body.category).toBe('food')
})

it('POST falls back to other for an unknown category', async () => {
  const res = await POST(
    req('http://x/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ tripId: 'tr1', amount: 10, category: 'bogus' }),
    }),
  )
  const body = await res.json()
  expect(body.category).toBe('other')
})

it('POST for a missing trip returns 404', async () => {
  const res = await POST(
    req('http://x/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ tripId: 'nope', amount: 10 }),
    }),
  )
  expect(res.status).toBe(404)
})

it('POST with non-positive amount returns 400', async () => {
  const res = await POST(
    req('http://x/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ tripId: 'tr1', amount: 0 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'amount required' })
})

it('DELETE removes an expense', async () => {
  const del = await DELETE(req('http://x/api/expenses?id=e1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/expenses?tripId=tr1'))
  const body = await res.json()
  expect(body.total).toBe(80)
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/expenses?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
})
