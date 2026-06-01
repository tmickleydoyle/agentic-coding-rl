import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/events/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded events', async () => {
  const res = await GET(req('http://x/api/events'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['e1', 'e2', 'e3'])
})

it('GET ?when=upcoming returns only upcoming events', async () => {
  const res = await GET(req('http://x/api/events?when=upcoming'))
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['e1', 'e3'])
})

it('GET ?when=past returns only past events', async () => {
  const res = await GET(req('http://x/api/events?when=past'))
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['e2'])
})

it('POST creates an event and returns 201', async () => {
  const res = await POST(
    req('http://x/api/events', { method: 'POST', body: JSON.stringify({ title: 'Picnic', day: 150 }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('e4')
  expect(body.title).toBe('Picnic')
  expect(body.rsvp).toBe(null)
  expect(body.going).toBe(0)
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/events', { method: 'POST', body: JSON.stringify({ day: 110 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT sets the rsvp', async () => {
  const res = await PUT(
    req('http://x/api/events?id=e2', { method: 'PUT', body: JSON.stringify({ rsvp: 'going' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.rsvp).toBe('going')
})

it('PUT with an invalid rsvp returns 400', async () => {
  const res = await PUT(
    req('http://x/api/events?id=e2', { method: 'PUT', body: JSON.stringify({ rsvp: 'perhaps' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid rsvp' })
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/events?id=nope', { method: 'PUT', body: JSON.stringify({ rsvp: 'going' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes an event', async () => {
  const del = await DELETE(req('http://x/api/events?id=e2', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/events'))
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['e1', 'e3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/events?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
})
