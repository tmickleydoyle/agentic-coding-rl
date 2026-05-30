import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/scores/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET starts empty with a zero tally', async () => {
  const res = await GET()
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.matches).toEqual([])
  expect(body.tally).toEqual({ x: 0, o: 0, draws: 0 })
})

it('POST records a match and returns 201', async () => {
  const res = await POST(
    req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ result: 'X' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('m1')
  expect(body.result).toBe('X')
})

it('POST with a bad result returns 400', async () => {
  const res = await POST(
    req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ result: 'Z' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'bad result' })
})

it('GET derives the tally from recorded matches', async () => {
  for (const r of ['X', 'X', 'O', 'draw']) {
    await POST(req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ result: r }) }))
  }
  const res = await GET()
  const body = await res.json()
  expect(body.tally).toEqual({ x: 2, o: 1, draws: 1 })
  expect(body.matches.map((m: { id: string }) => m.id)).toEqual(['m1', 'm2', 'm3', 'm4'])
})

it('DELETE removes a single match', async () => {
  await POST(req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ result: 'X' }) }))
  await POST(req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ result: 'O' }) }))
  const del = await DELETE(req('http://x/api/scores?id=m1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const body = await (await GET()).json()
  expect(body.matches.map((m: { id: string }) => m.id)).toEqual(['m2'])
})

it('DELETE ?id=all clears everything', async () => {
  await POST(req('http://x/api/scores', { method: 'POST', body: JSON.stringify({ result: 'X' }) }))
  const del = await DELETE(req('http://x/api/scores?id=all', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  const body = await (await GET()).json()
  expect(body.matches).toEqual([])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/scores?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
