import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/bookings/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded bookings', async () => {
  const res = await GET(req('http://x/api/bookings'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.bookings.map((b: { id: string }) => b.id)).toEqual(['b1', 'b2'])
})

it('GET filters by venueId', async () => {
  const res = await GET(req('http://x/api/bookings?venueId=g1'))
  const body = await res.json()
  expect(body.bookings.map((b: { id: string }) => b.id)).toEqual(['b1'])
})

it('GET filters by date', async () => {
  const res = await GET(req('http://x/api/bookings?date=2026-06-02'))
  const body = await res.json()
  expect(body.bookings.map((b: { id: string }) => b.id)).toEqual(['b2'])
})

it('POST creates a booking and returns 201', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        venueId: 'g1',
        date: '2026-06-03',
        attendees: 100,
        organizer: 'Linus',
      }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('b3')
  expect(body.attendees).toBe(100)
})

it('POST with a missing field returns 400', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ venueId: 'g1', date: '2026-06-03', attendees: 100 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid booking' })
})

it('POST with a non-positive attendees returns 400', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        venueId: 'g1',
        date: '2026-06-03',
        attendees: 0,
        organizer: 'Z',
      }),
    }),
  )
  expect(res.status).toBe(400)
})

it('POST to an unknown venue returns 404', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        venueId: 'gX',
        date: '2026-06-03',
        attendees: 10,
        organizer: 'Ghost',
      }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST over capacity returns 422', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        venueId: 'g2',
        date: '2026-06-03',
        attendees: 100,
        organizer: 'Big',
      }),
    }),
  )
  expect(res.status).toBe(422)
  expect(await res.json()).toEqual({ error: 'over capacity' })
})

it('POST on a taken date returns 409', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        venueId: 'g1',
        date: '2026-06-01',
        attendees: 10,
        organizer: 'Late',
      }),
    }),
  )
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'date taken' })
})

it('the same venue on a different date is allowed', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        venueId: 'g1',
        date: '2026-06-02',
        attendees: 10,
        organizer: 'Early',
      }),
    }),
  )
  expect(res.status).toBe(201)
})

it('DELETE removes a booking', async () => {
  const del = await DELETE(req('http://x/api/bookings?id=b1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/bookings'))
  const body = await res.json()
  expect(body.bookings.map((b: { id: string }) => b.id)).toEqual(['b2'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/bookings?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
