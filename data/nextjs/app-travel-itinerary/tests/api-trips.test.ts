import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/trips/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists trips with cost', async () => {
  const res = await GET(req('http://x/api/trips'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.trips.map((t: { id: string }) => t.id)).toEqual(['tr1', 'tr2'])
  const tr1 = body.trips.find((t: { id: string }) => t.id === 'tr1')
  expect(tr1.cost).toBe(180)
})

it('GET by tripId returns the trip, its activities and cost', async () => {
  const res = await GET(req('http://x/api/trips?tripId=tr1'))
  const body = await res.json()
  expect(body.trip.id).toBe('tr1')
  expect(body.activities.map((a: { id: string }) => a.id)).toEqual(['a1', 'a2', 'a3'])
  expect(body.cost).toBe(180)
})

it('GET by unknown tripId returns 404', async () => {
  const res = await GET(req('http://x/api/trips?tripId=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST creates a trip and returns 201', async () => {
  const res = await POST(
    req('http://x/api/trips', {
      method: 'POST',
      body: JSON.stringify({ name: 'Peru', destination: 'Lima', days: 4 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('tr3')
  expect(body.name).toBe('Peru')
  expect(body.days).toBe(4)
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/trips', { method: 'POST', body: JSON.stringify({ destination: 'x' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST with a tripId creates an activity (201)', async () => {
  const res = await POST(
    req('http://x/api/trips', {
      method: 'POST',
      body: JSON.stringify({ tripId: 'tr2', day: 2, title: 'Vatican', cost: 30 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('a5')
  expect(body.tripId).toBe('tr2')
  expect(body.cost).toBe(30)
})

it('POST activity for a missing trip returns 404', async () => {
  const res = await POST(
    req('http://x/api/trips', {
      method: 'POST',
      body: JSON.stringify({ tripId: 'nope', title: 'x' }),
    }),
  )
  expect(res.status).toBe(404)
})

it('POST activity with blank title returns 400', async () => {
  const res = await POST(
    req('http://x/api/trips', {
      method: 'POST',
      body: JSON.stringify({ tripId: 'tr1', title: '   ' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('DELETE removes an activity', async () => {
  const del = await DELETE(req('http://x/api/trips?activityId=a1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/trips?tripId=tr1'))
  const body = await res.json()
  expect(body.activities.map((a: { id: string }) => a.id)).toEqual(['a2', 'a3'])
})

it('DELETE on a missing activity returns 404', async () => {
  const res = await DELETE(req('http://x/api/trips?activityId=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
