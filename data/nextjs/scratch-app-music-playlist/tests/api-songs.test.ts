import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/songs/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded songs', async () => {
  const res = await GET(req('http://x/api/songs'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.songs.map((s: { id: string }) => s.id)).toEqual(['s1', 's2', 's3', 's4'])
})

it('GET filters by genre', async () => {
  const res = await GET(req('http://x/api/songs?genre=rock'))
  const body = await res.json()
  expect(body.songs.map((s: { id: string }) => s.id)).toEqual(['s2', 's4'])
})

it('GET filters by artist', async () => {
  const res = await GET(req('http://x/api/songs?artist=Echo'))
  const body = await res.json()
  expect(body.songs.map((s: { id: string }) => s.id)).toEqual(['s3', 's4'])
})

it('GET filters by q (matches title or artist, case-insensitive)', async () => {
  const res = await GET(req('http://x/api/songs?q=ARIA'))
  const body = await res.json()
  expect(body.songs.map((s: { id: string }) => s.id)).toEqual(['s1', 's2'])
})

it('POST creates a song and returns 201', async () => {
  const res = await POST(
    req('http://x/api/songs', {
      method: 'POST',
      body: JSON.stringify({ title: 'Skyline', artist: 'Nova', genre: 'pop', durationSec: 195 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('Skyline')
  expect(body.artist).toBe('Nova')
  expect(body.playCount).toBe(0)
  expect(body.durationSec).toBe(195)
  expect(body.id).toBe('s5')
})

it('POST defaults genre and durationSec when omitted', async () => {
  const res = await POST(
    req('http://x/api/songs', { method: 'POST', body: JSON.stringify({ title: 'X', artist: 'Y' }) }),
  )
  const body = await res.json()
  expect(body.genre).toBe('')
  expect(body.durationSec).toBe(0)
})

it('POST without an artist returns 400', async () => {
  const res = await POST(
    req('http://x/api/songs', { method: 'POST', body: JSON.stringify({ title: 'x' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title and artist required' })
})

it('PUT with play=true increments the play count', async () => {
  const res = await PUT(
    req('http://x/api/songs?id=s2', { method: 'PUT', body: JSON.stringify({ play: true }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.playCount).toBe(4)
})

it('PUT patches fields', async () => {
  const res = await PUT(
    req('http://x/api/songs?id=s1', { method: 'PUT', body: JSON.stringify({ genre: 'indie' }) }),
  )
  const body = await res.json()
  expect(body.genre).toBe('indie')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/songs?id=nope', { method: 'PUT', body: JSON.stringify({ play: true }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a song', async () => {
  const del = await DELETE(req('http://x/api/songs?id=s1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/songs'))
  const body = await res.json()
  expect(body.songs.map((s: { id: string }) => s.id)).toEqual(['s2', 's3', 's4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/songs?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
