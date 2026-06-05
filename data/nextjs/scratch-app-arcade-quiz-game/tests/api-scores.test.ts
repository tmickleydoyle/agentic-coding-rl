import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/scores/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET returns the seeded leaderboard ranked by score', async () => {
  const res = await GET()
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['e1', 'e2'])
})

it('POST adds an entry and returns 201', async () => {
  const res = await POST(
    req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ name: 'Zed', score: 40 }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('e3')
  expect(body.name).toBe('Zed')
  expect(body.score).toBe(40)
})

it('POST ranks a high score to the top of GET', async () => {
  await POST(req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ name: 'Zed', score: 99 }) }))
  const body = await (await GET()).json()
  expect(body.entries[0].name).toBe('Zed')
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ name: '  ', score: 10 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST with a bad score returns 400', async () => {
  const res = await POST(
    req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ name: 'Z', score: -1 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'bad score' })
})

it('DELETE removes an entry', async () => {
  const del = await DELETE(req('http://x/api/scores?id=e1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const body = await (await GET()).json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['e2'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/scores?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
