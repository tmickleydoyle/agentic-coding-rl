import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/videos/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded videos', async () => {
  const res = await GET(req('http://x/api/videos'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.videos.map((v: { id: string }) => v.id)).toEqual(['v1', 'v2', 'v3', 'v4'])
})

it('GET by id returns a single video', async () => {
  const res = await GET(req('http://x/api/videos?id=v3'))
  const body = await res.json()
  expect(body.video.title).toBe('Color Theory')
  expect(body.video.views).toBe(200)
})

it('GET by unknown id returns 404', async () => {
  const res = await GET(req('http://x/api/videos?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('GET by channelId filters videos', async () => {
  const res = await GET(req('http://x/api/videos?channelId=ch2'))
  const body = await res.json()
  expect(body.videos.map((v: { id: string }) => v.id)).toEqual(['v3', 'v4'])
})

it('GET sorted by views descending', async () => {
  const res = await GET(req('http://x/api/videos?sort=views'))
  const body = await res.json()
  expect(body.videos.map((v: { id: string }) => v.id)).toEqual(['v3', 'v1', 'v2', 'v4'])
})

it('GET sorted by recent (uploaded descending)', async () => {
  const res = await GET(req('http://x/api/videos?sort=recent'))
  const body = await res.json()
  expect(body.videos.map((v: { id: string }) => v.id)).toEqual(['v4', 'v1', 'v3', 'v2'])
})

it('POST records a view and returns the updated video', async () => {
  const res = await POST(
    req('http://x/api/videos', { method: 'POST', body: JSON.stringify({ id: 'v1' }) }),
  )
  expect(res.status).toBe(200)
  expect((await res.json()).video.views).toBe(121)
})

it('POST view persists across calls', async () => {
  await POST(req('http://x/api/videos', { method: 'POST', body: JSON.stringify({ id: 'v1' }) }))
  await POST(req('http://x/api/videos', { method: 'POST', body: JSON.stringify({ id: 'v1' }) }))
  const res = await GET(req('http://x/api/videos?id=v1'))
  expect((await res.json()).video.views).toBe(122)
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
