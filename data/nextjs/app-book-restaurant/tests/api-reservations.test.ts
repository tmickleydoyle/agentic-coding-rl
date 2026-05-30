import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/reservations/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded reservations', async () => {
  const res = await GET(req('http://x/api/reservations'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.reservations.map((r: { id: string }) => r.id)).toEqual(['r1', 'r2'])
})

it('GET filters by tableId', async () => {
  const res = await GET(req('http://x/api/reservations?tableId=t1'))
  const body = await res.json()
  expect(body.reservations.map((r: { id: string }) => r.id)).toEqual(['r1'])
})

it('GET filters by time', async () => {
  const res = await GET(req('http://x/api/reservations?time=20:00'))
  const body = await res.json()
  expect(body.reservations.map((r: { id: string }) => r.id)).toEqual(['r2'])
})

it('POST creates a reservation and returns 201', async () => {
  const res = await POST(
    req('http://x/api/reservations', {
      method: 'POST',
      body: JSON.stringify({ tableId: 't3', time: '18:00', party: 5, name: 'Linus' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('r3')
  expect(body.tableId).toBe('t3')
  expect(body.party).toBe(5)
})

it('POST with a missing field returns 400', async () => {
  const res = await POST(
    req('http://x/api/reservations', {
      method: 'POST',
      body: JSON.stringify({ tableId: 't1', time: '18:00', party: 2 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid reservation' })
})

it('POST with a non-positive party returns 400', async () => {
  const res = await POST(
    req('http://x/api/reservations', {
      method: 'POST',
      body: JSON.stringify({ tableId: 't1', time: '18:00', party: 0, name: 'Zero' }),
    }),
  )
  expect(res.status).toBe(400)
})

it('POST over capacity returns 422', async () => {
  const res = await POST(
    req('http://x/api/reservations', {
      method: 'POST',
      body: JSON.stringify({ tableId: 't1', time: '18:00', party: 4, name: 'Big' }),
    }),
  )
  expect(res.status).toBe(422)
  expect(await res.json()).toEqual({ error: 'over capacity' })
})

it('POST into a taken table+time returns 409', async () => {
  const res = await POST(
    req('http://x/api/reservations', {
      method: 'POST',
      body: JSON.stringify({ tableId: 't1', time: '19:00', party: 2, name: 'Late' }),
    }),
  )
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'table taken' })
})

it('the same table at a different time is allowed', async () => {
  const res = await POST(
    req('http://x/api/reservations', {
      method: 'POST',
      body: JSON.stringify({ tableId: 't1', time: '18:00', party: 2, name: 'Early' }),
    }),
  )
  expect(res.status).toBe(201)
})

it('DELETE removes a reservation', async () => {
  const del = await DELETE(req('http://x/api/reservations?id=r1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/reservations'))
  const body = await res.json()
  expect(body.reservations.map((r: { id: string }) => r.id)).toEqual(['r2'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/reservations?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
