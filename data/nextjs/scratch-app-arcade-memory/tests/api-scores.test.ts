import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/scores/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET starts empty with a null best', async () => {
  const res = await GET()
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.runs).toEqual([])
  expect(body.best).toBeNull()
})

it('POST records a run and returns 201', async () => {
  const res = await POST(
    req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ moves: 12 }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('r1')
  expect(body.moves).toBe(12)
})

it('POST with bad moves returns 400', async () => {
  const res = await POST(
    req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ moves: 0 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'bad moves' })
})

it('POST with non-integer moves returns 400', async () => {
  const res = await POST(
    req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ moves: 3.5 }) }),
  )
  expect(res.status).toBe(400)
})

it('GET reports the smallest moves as best', async () => {
  for (const m of [14, 9, 11]) {
    await POST(req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ moves: m }) }))
  }
  const body = await (await GET()).json()
  expect(body.best).toBe(9)
  expect(body.runs.map((r: { id: string }) => r.id)).toEqual(['r1', 'r2', 'r3'])
})

it('DELETE removes a run', async () => {
  await POST(req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ moves: 8 }) }))
  const del = await DELETE(req('http://x/api/scores?id=r1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const body = await (await GET()).json()
  expect(body.runs).toEqual([])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/scores?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
