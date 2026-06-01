import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/bookings/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded bookings', async () => {
  const res = await GET(req('http://x/api/bookings'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.bookings.map((b: { id: string }) => b.id)).toEqual(['k1', 'k2'])
})

it('GET filters by roomId', async () => {
  const res = await GET(req('http://x/api/bookings?roomId=m1'))
  const body = await res.json()
  expect(body.bookings.map((b: { id: string }) => b.id)).toEqual(['k1'])
})

it('POST creates a booking and returns 201', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ roomId: 'm3', start: 9, end: 10, title: 'Kickoff' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('k3')
  expect(body.roomId).toBe('m3')
  expect(body.start).toBe(9)
  expect(body.end).toBe(10)
})

it('POST with a missing title returns 400', async () => {
  const res = await POST(
    req('http://x/api/bookings', { method: 'POST', body: JSON.stringify({ roomId: 'm1', start: 11, end: 12 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid booking' })
})

it('POST with start not before end returns 400', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ roomId: 'm1', start: 12, end: 12, title: 'Zero length' }),
    }),
  )
  expect(res.status).toBe(400)
})

it('POST with non-numeric hours returns 400', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ roomId: 'm1', start: '9', end: '10', title: 'Strings' }),
    }),
  )
  expect(res.status).toBe(400)
})

it('POST overlapping an existing booking returns 409', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ roomId: 'm1', start: 9, end: 11, title: 'Overlap' }),
    }),
  )
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'conflict' })
})

it('POST touching an existing booking is allowed', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ roomId: 'm1', start: 10, end: 11, title: 'After standup' }),
    }),
  )
  expect(res.status).toBe(201)
})

it('the same time on a different room is allowed', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ roomId: 'm3', start: 9, end: 10, title: 'Elsewhere' }),
    }),
  )
  expect(res.status).toBe(201)
})

it('DELETE removes a booking', async () => {
  const del = await DELETE(req('http://x/api/bookings?id=k1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/bookings'))
  const body = await res.json()
  expect(body.bookings.map((b: { id: string }) => b.id)).toEqual(['k2'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/bookings?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
