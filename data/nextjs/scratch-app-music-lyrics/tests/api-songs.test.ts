import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/songs/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded songs', async () => {
  const res = await GET(req('http://x/api/songs'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.songs.map((s: { id: string }) => s.id)).toEqual(['g1', 'g2', 'g3'])
})

it('GET filters by artist', async () => {
  const res = await GET(req('http://x/api/songs?artist=Aria'))
  const body = await res.json()
  expect(body.songs.map((s: { id: string }) => s.id)).toEqual(['g1', 'g2'])
})

it('GET filters by q (matches a lyric line, case-insensitive)', async () => {
  const res = await GET(req('http://x/api/songs?q=NEON'))
  const body = await res.json()
  expect(body.songs.map((s: { id: string }) => s.id)).toEqual(['g3'])
})

it('GET q also matches the title', async () => {
  const res = await GET(req('http://x/api/songs?q=quiet'))
  const body = await res.json()
  expect(body.songs.map((s: { id: string }) => s.id)).toEqual(['g2'])
})

it('POST creates a song and returns 201', async () => {
  const res = await POST(
    req('http://x/api/songs', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Song', artist: 'Nova', lines: ['hello world'] }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('New Song')
  expect(body.artist).toBe('Nova')
  expect(body.lines).toEqual(['hello world'])
  expect(body.id).toBe('g4')
})

it('POST defaults lines to an empty array', async () => {
  const res = await POST(
    req('http://x/api/songs', { method: 'POST', body: JSON.stringify({ title: 'X', artist: 'Y' }) }),
  )
  const body = await res.json()
  expect(body.lines).toEqual([])
})

it('POST without an artist returns 400', async () => {
  const res = await POST(
    req('http://x/api/songs', { method: 'POST', body: JSON.stringify({ title: 'x' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title and artist required' })
})

it('PUT replaces the lines', async () => {
  const res = await PUT(
    req('http://x/api/songs?id=g2', {
      method: 'PUT',
      body: JSON.stringify({ lines: ['only one line'] }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.lines).toEqual(['only one line'])
})

it('PUT patches the title', async () => {
  const res = await PUT(
    req('http://x/api/songs?id=g1', { method: 'PUT', body: JSON.stringify({ title: 'Renamed' }) }),
  )
  const body = await res.json()
  expect(body.title).toBe('Renamed')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/songs?id=nope', { method: 'PUT', body: JSON.stringify({ title: 'x' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a song', async () => {
  const del = await DELETE(req('http://x/api/songs?id=g1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/songs'))
  const body = await res.json()
  expect(body.songs.map((s: { id: string }) => s.id)).toEqual(['g2', 'g3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/songs?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
