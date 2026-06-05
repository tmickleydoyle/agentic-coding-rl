import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/albums/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded albums', async () => {
  const res = await GET(req('http://x/api/albums'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.albums.map((a: { id: string }) => a.id)).toEqual(['a1', 'a2', 'a3', 'a4'])
})

it('GET filters by artist', async () => {
  const res = await GET(req('http://x/api/albums?artist=Aria'))
  const body = await res.json()
  expect(body.albums.map((a: { id: string }) => a.id)).toEqual(['a1', 'a2'])
})

it('GET filters by favorite=true', async () => {
  const res = await GET(req('http://x/api/albums?favorite=true'))
  const body = await res.json()
  expect(body.albums.map((a: { id: string }) => a.id)).toEqual(['a1', 'a4'])
})

it('GET filters by minRating', async () => {
  const res = await GET(req('http://x/api/albums?minRating=4'))
  const body = await res.json()
  expect(body.albums.map((a: { id: string }) => a.id)).toEqual(['a1', 'a3'])
})

it('POST creates an album and returns 201', async () => {
  const res = await POST(
    req('http://x/api/albums', {
      method: 'POST',
      body: JSON.stringify({ title: 'Aurora', artist: 'Nova', year: 2024 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('Aurora')
  expect(body.artist).toBe('Nova')
  expect(body.year).toBe(2024)
  expect(body.favorite).toBe(false)
  expect(body.rating).toBe(0)
  expect(body.tracks).toEqual([])
  expect(body.id).toBe('a5')
})

it('POST defaults year to 0', async () => {
  const res = await POST(
    req('http://x/api/albums', { method: 'POST', body: JSON.stringify({ title: 'X', artist: 'Y' }) }),
  )
  const body = await res.json()
  expect(body.year).toBe(0)
})

it('POST without an artist returns 400', async () => {
  const res = await POST(
    req('http://x/api/albums', { method: 'POST', body: JSON.stringify({ title: 'x' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title and artist required' })
})

it('PUT sets a rating', async () => {
  const res = await PUT(
    req('http://x/api/albums?id=a2', { method: 'PUT', body: JSON.stringify({ rating: 3 }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.rating).toBe(3)
})

it('PUT clamps a rating above 5', async () => {
  const res = await PUT(
    req('http://x/api/albums?id=a2', { method: 'PUT', body: JSON.stringify({ rating: 9 }) }),
  )
  const body = await res.json()
  expect(body.rating).toBe(5)
})

it('PUT toggles favorite explicitly', async () => {
  const res = await PUT(
    req('http://x/api/albums?id=a2', { method: 'PUT', body: JSON.stringify({ favorite: true }) }),
  )
  const body = await res.json()
  expect(body.favorite).toBe(true)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/albums?id=nope', { method: 'PUT', body: JSON.stringify({ rating: 3 }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes an album', async () => {
  const del = await DELETE(req('http://x/api/albums?id=a1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/albums'))
  const body = await res.json()
  expect(body.albums.map((a: { id: string }) => a.id)).toEqual(['a2', 'a3', 'a4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/albums?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
