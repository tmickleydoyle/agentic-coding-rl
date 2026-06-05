import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PATCH, DELETE, __reset } from '../app/api/events/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded events', async () => {
  const res = await GET(req('http://x/api/events'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['e1', 'e2'])
})

it('GET filters by id', async () => {
  const res = await GET(req('http://x/api/events?id=e1'))
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['e1'])
  expect(body.events[0].invites.map((i: { id: string }) => i.id)).toEqual(['i1', 'i2', 'i3'])
})

it('POST creates an event with empty invites and returns 201', async () => {
  const res = await POST(
    req('http://x/api/events', {
      method: 'POST',
      body: JSON.stringify({ name: 'Hackathon', date: '2026-11-01' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('e3')
  expect(body.invites).toEqual([])
})

it('POST with a blank name returns 400', async () => {
  const res = await POST(
    req('http://x/api/events', {
      method: 'POST',
      body: JSON.stringify({ name: '   ', date: '2026-11-01' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid event' })
})

it('PATCH updates an invite RSVP and returns 200', async () => {
  const res = await PATCH(
    req('http://x/api/events', {
      method: 'PATCH',
      body: JSON.stringify({ eventId: 'e1', inviteId: 'i2', status: 'yes', extraGuests: 1 }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('yes')
  expect(body.extraGuests).toBe(1)
})

it('PATCH on an unknown invite returns 404', async () => {
  const res = await PATCH(
    req('http://x/api/events', {
      method: 'PATCH',
      body: JSON.stringify({ eventId: 'e1', inviteId: 'iX', status: 'yes', extraGuests: 0 }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('PATCH with a bad status returns 400', async () => {
  const res = await PATCH(
    req('http://x/api/events', {
      method: 'PATCH',
      body: JSON.stringify({ eventId: 'e1', inviteId: 'i1', status: 'soon', extraGuests: 0 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid rsvp' })
})

it('PATCH with negative extraGuests returns 400', async () => {
  const res = await PATCH(
    req('http://x/api/events', {
      method: 'PATCH',
      body: JSON.stringify({ eventId: 'e1', inviteId: 'i1', status: 'yes', extraGuests: -1 }),
    }),
  )
  expect(res.status).toBe(400)
})

it('DELETE removes an event', async () => {
  const del = await DELETE(req('http://x/api/events?id=e2', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/events'))
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['e1'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/events?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
