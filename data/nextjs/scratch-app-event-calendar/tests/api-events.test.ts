import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/events/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded events', async () => {
  const res = await GET(req('http://x/api/events'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['v1', 'v2', 'v3'])
})

it('GET filters by category', async () => {
  const res = await GET(req('http://x/api/events?category=work'))
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['v1'])
})

it('GET filters by day', async () => {
  const res = await GET(req('http://x/api/events?day=2'))
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['v1', 'v2'])
})

it('GET combines category and day filters with AND', async () => {
  const res = await GET(req('http://x/api/events?category=social&day=2'))
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['v2'])
})

it('POST creates an event and returns 201', async () => {
  const res = await POST(
    req('http://x/api/events', {
      method: 'POST',
      body: JSON.stringify({ title: 'Party', day: 20, category: 'social' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('v4')
  expect(body.day).toBe(20)
})

it('POST with a blank title returns 400', async () => {
  const res = await POST(
    req('http://x/api/events', {
      method: 'POST',
      body: JSON.stringify({ title: '  ', day: 20, category: 'social' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid event' })
})

it('POST with an out-of-range day returns 422', async () => {
  const res = await POST(
    req('http://x/api/events', {
      method: 'POST',
      body: JSON.stringify({ title: 'Party', day: 40, category: 'social' }),
    }),
  )
  expect(res.status).toBe(422)
  expect(await res.json()).toEqual({ error: 'bad day' })
})

it('POST with a non-integer day returns 422', async () => {
  const res = await POST(
    req('http://x/api/events', {
      method: 'POST',
      body: JSON.stringify({ title: 'Party', day: 2.5, category: 'social' }),
    }),
  )
  expect(res.status).toBe(422)
})

it('DELETE removes an event', async () => {
  const del = await DELETE(req('http://x/api/events?id=v1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/events'))
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['v2', 'v3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/events?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
