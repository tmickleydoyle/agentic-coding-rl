import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/clips/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded clips', async () => {
  const res = await GET(req('http://x/api/clips'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.clips.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2', 'c3', 'c4', 'c5'])
})

it('GET by id returns a single clip', async () => {
  const res = await GET(req('http://x/api/clips?id=c2'))
  const body = await res.json()
  expect(body.clip.title).toBe('Funny Cat')
  expect(body.clip.likes).toBe(42)
})

it('GET by unknown id returns 404', async () => {
  const res = await GET(req('http://x/api/clips?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('GET by category filters clips', async () => {
  const res = await GET(req('http://x/api/clips?category=Fun'))
  const body = await res.json()
  expect(body.clips.map((c: { id: string }) => c.id)).toEqual(['c2', 'c4'])
})

it('POST likes a clip and returns the updated clip', async () => {
  const res = await POST(
    req('http://x/api/clips', { method: 'POST', body: JSON.stringify({ id: 'c1' }) }),
  )
  expect(res.status).toBe(200)
  expect((await res.json()).clip.likes).toBe(11)
})

it('POST likes persist across calls', async () => {
  await POST(req('http://x/api/clips', { method: 'POST', body: JSON.stringify({ id: 'c1' }) }))
  await POST(req('http://x/api/clips', { method: 'POST', body: JSON.stringify({ id: 'c1' }) }))
  const res = await GET(req('http://x/api/clips?id=c1'))
  expect((await res.json()).clip.likes).toBe(12)
})

it('POST on an unknown clip returns 404', async () => {
  const res = await POST(
    req('http://x/api/clips', { method: 'POST', body: JSON.stringify({ id: 'nope' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST without an id returns 400', async () => {
  const res = await POST(req('http://x/api/clips', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'id required' })
})

it('reset restores original like counts', async () => {
  await POST(req('http://x/api/clips', { method: 'POST', body: JSON.stringify({ id: 'c1' }) }))
  __reset()
  const res = await GET(req('http://x/api/clips?id=c1'))
  expect((await res.json()).clip.likes).toBe(10)
})
