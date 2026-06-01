import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/scores/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded scores', async () => {
  const res = await GET(req('http://x/api/scores'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.scores.map((s: { id: string }) => s.id)).toEqual([
    's1',
    's2',
    's3',
    's4',
    's5',
    's6',
  ])
})

it('GET filters by gameId', async () => {
  const res = await GET(req('http://x/api/scores?gameId=g1'))
  const body = await res.json()
  expect(body.scores.map((s: { id: string }) => s.id)).toEqual(['s1', 's2', 's3'])
})

it('GET sorts by rank (points descending)', async () => {
  const res = await GET(req('http://x/api/scores?gameId=g1&sort=rank'))
  const body = await res.json()
  expect(body.scores.map((s: { id: string }) => s.id)).toEqual(['s3', 's1', 's2'])
})

it('POST creates a score and returns 201', async () => {
  const res = await POST(
    req('http://x/api/scores', {
      method: 'POST',
      body: JSON.stringify({ gameId: 'g1', player: 'Zed', points: 2000 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('s7')
  expect(body.player).toBe('Zed')
  expect(body.points).toBe(2000)
})

it('POST with an unknown game returns 400 bad game', async () => {
  const res = await POST(
    req('http://x/api/scores', {
      method: 'POST',
      body: JSON.stringify({ gameId: 'nope', player: 'Z', points: 1 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'bad game' })
})

it('POST without a player returns 400 player required', async () => {
  const res = await POST(
    req('http://x/api/scores', {
      method: 'POST',
      body: JSON.stringify({ gameId: 'g1', player: '   ', points: 1 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'player required' })
})

it('POST with bad points returns 400 bad points', async () => {
  const res = await POST(
    req('http://x/api/scores', {
      method: 'POST',
      body: JSON.stringify({ gameId: 'g1', player: 'Z', points: -3 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'bad points' })
})

it('DELETE removes a score', async () => {
  const del = await DELETE(req('http://x/api/scores?id=s1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/scores'))
  const body = await res.json()
  expect(body.scores.map((s: { id: string }) => s.id)).toEqual([
    's2',
    's3',
    's4',
    's5',
    's6',
  ])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/scores?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
