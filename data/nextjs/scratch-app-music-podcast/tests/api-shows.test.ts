import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/shows/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded shows', async () => {
  const res = await GET(req('http://x/api/shows'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.shows.map((s: { id: string }) => s.id)).toEqual(['sh1', 'sh2', 'sh3'])
})

it('GET filters by category', async () => {
  const res = await GET(req('http://x/api/shows?category=tech'))
  const body = await res.json()
  expect(body.shows.map((s: { id: string }) => s.id)).toEqual(['sh1', 'sh3'])
})

it('GET filters by subscribed=true', async () => {
  const res = await GET(req('http://x/api/shows?subscribed=true'))
  const body = await res.json()
  expect(body.shows.map((s: { id: string }) => s.id)).toEqual(['sh1'])
})

it('POST creates a show and returns 201', async () => {
  const res = await POST(
    req('http://x/api/shows', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Show', category: 'comedy' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('New Show')
  expect(body.category).toBe('comedy')
  expect(body.subscribed).toBe(false)
  expect(body.episodes).toEqual([])
  expect(body.id).toBe('sh4')
})

it('POST defaults category to empty string', async () => {
  const res = await POST(
    req('http://x/api/shows', { method: 'POST', body: JSON.stringify({ title: 'X' }) }),
  )
  const body = await res.json()
  expect(body.category).toBe('')
})

it('POST without a title returns 400', async () => {
  const res = await POST(
    req('http://x/api/shows', { method: 'POST', body: JSON.stringify({ category: 'x' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT with subscribe=true subscribes the show', async () => {
  const res = await PUT(
    req('http://x/api/shows?id=sh2', { method: 'PUT', body: JSON.stringify({ subscribe: true }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.subscribed).toBe(true)
})

it('PUT with subscribe=false unsubscribes the show', async () => {
  const res = await PUT(
    req('http://x/api/shows?id=sh1', { method: 'PUT', body: JSON.stringify({ subscribe: false }) }),
  )
  const body = await res.json()
  expect(body.subscribed).toBe(false)
})

it('PUT patches the title', async () => {
  const res = await PUT(
    req('http://x/api/shows?id=sh1', { method: 'PUT', body: JSON.stringify({ title: 'Renamed' }) }),
  )
  const body = await res.json()
  expect(body.title).toBe('Renamed')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/shows?id=nope', { method: 'PUT', body: JSON.stringify({ subscribe: true }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a show', async () => {
  const del = await DELETE(req('http://x/api/shows?id=sh1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/shows'))
  const body = await res.json()
  expect(body.shows.map((s: { id: string }) => s.id)).toEqual(['sh2', 'sh3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/shows?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
