import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/videos/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded videos', async () => {
  const res = await GET(req('http://x/api/videos'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.videos.map((v: { id: string }) => v.id)).toEqual(['v1', 'v2', 'v3', 'v4', 'v5'])
})

it('GET by id returns a single video', async () => {
  const res = await GET(req('http://x/api/videos?id=v2'))
  const body = await res.json()
  expect(body.video.title).toBe('Advanced Generics')
  expect(body.video.duration).toBe(900)
})

it('GET by unknown id returns 404', async () => {
  const res = await GET(req('http://x/api/videos?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('GET by category filters videos', async () => {
  const res = await GET(req('http://x/api/videos?category=CSS'))
  const body = await res.json()
  expect(body.videos.map((v: { id: string }) => v.id)).toEqual(['v3', 'v5'])
})

it('POST marks a video watched and returns watchedIds', async () => {
  const res = await POST(
    req('http://x/api/videos', { method: 'POST', body: JSON.stringify({ id: 'v1' }) }),
  )
  expect(res.status).toBe(200)
  expect((await res.json()).watchedIds).toEqual(['v1'])
})

it('POST prepends newest watched first without duplicating', async () => {
  await POST(req('http://x/api/videos', { method: 'POST', body: JSON.stringify({ id: 'v1' }) }))
  await POST(req('http://x/api/videos', { method: 'POST', body: JSON.stringify({ id: 'v2' }) }))
  const dup = await POST(
    req('http://x/api/videos', { method: 'POST', body: JSON.stringify({ id: 'v1' }) }),
  )
  expect((await dup.json()).watchedIds).toEqual(['v2', 'v1'])
})

it('POST on an unknown video returns 404', async () => {
  const res = await POST(
    req('http://x/api/videos', { method: 'POST', body: JSON.stringify({ id: 'nope' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST without an id returns 400', async () => {
  const res = await POST(req('http://x/api/videos', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'id required' })
})

it('DELETE clears a watched video', async () => {
  await POST(req('http://x/api/videos', { method: 'POST', body: JSON.stringify({ id: 'v1' }) }))
  const del = await DELETE(req('http://x/api/videos?id=v1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
})

it('DELETE on a non-watched video returns 404', async () => {
  const res = await DELETE(req('http://x/api/videos?id=v1', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
