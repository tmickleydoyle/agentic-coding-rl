import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/stations/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded stations', async () => {
  const res = await GET(req('http://x/api/stations'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.stations.map((s: { id: string }) => s.id)).toEqual(['r1', 'r2', 'r3', 'r4'])
})

it('GET filters by genre', async () => {
  const res = await GET(req('http://x/api/stations?genre=rock'))
  const body = await res.json()
  expect(body.stations.map((s: { id: string }) => s.id)).toEqual(['r2'])
})

it('GET filters by favorite=true', async () => {
  const res = await GET(req('http://x/api/stations?favorite=true'))
  const body = await res.json()
  expect(body.stations.map((s: { id: string }) => s.id)).toEqual(['r1', 'r3'])
})

it('GET filters by minBitrate', async () => {
  const res = await GET(req('http://x/api/stations?minBitrate=256'))
  const body = await res.json()
  expect(body.stations.map((s: { id: string }) => s.id)).toEqual(['r2', 'r3'])
})

it('POST creates a station and returns 201', async () => {
  const res = await POST(
    req('http://x/api/stations', {
      method: 'POST',
      body: JSON.stringify({ name: 'Indie Air', genre: 'indie', bitrate: 192 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Indie Air')
  expect(body.genre).toBe('indie')
  expect(body.bitrate).toBe(192)
  expect(body.favorite).toBe(false)
  expect(body.playCount).toBe(0)
  expect(body.id).toBe('r5')
})

it('POST defaults genre and bitrate', async () => {
  const res = await POST(
    req('http://x/api/stations', { method: 'POST', body: JSON.stringify({ name: 'X' }) }),
  )
  const body = await res.json()
  expect(body.genre).toBe('')
  expect(body.bitrate).toBe(0)
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/stations', { method: 'POST', body: JSON.stringify({ genre: 'x' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('PUT with play=true increments the play count', async () => {
  const res = await PUT(
    req('http://x/api/stations?id=r2', { method: 'PUT', body: JSON.stringify({ play: true }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.playCount).toBe(3)
})

it('PUT toggles favorite explicitly', async () => {
  const res = await PUT(
    req('http://x/api/stations?id=r2', { method: 'PUT', body: JSON.stringify({ favorite: true }) }),
  )
  const body = await res.json()
  expect(body.favorite).toBe(true)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/stations?id=nope', { method: 'PUT', body: JSON.stringify({ play: true }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a station', async () => {
  const del = await DELETE(req('http://x/api/stations?id=r1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/stations'))
  const body = await res.json()
  expect(body.stations.map((s: { id: string }) => s.id)).toEqual(['r2', 'r3', 'r4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/stations?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
