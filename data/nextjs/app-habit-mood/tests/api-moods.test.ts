import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/moods/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded entries', async () => {
  const res = await GET(req('http://x/api/moods'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['m1', 'm2', 'm3'])
})

it('POST creates an entry for a new date with id m4', async () => {
  const res = await POST(
    req('http://x/api/moods', {
      method: 'POST',
      body: JSON.stringify({ date: '2026-05-28', score: 3, triggers: ['rain'] }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('m4')
  expect(body.score).toBe(3)
  expect(body.triggers).toEqual(['rain'])
})

it('POST defaults triggers to an empty array', async () => {
  const res = await POST(
    req('http://x/api/moods', { method: 'POST', body: JSON.stringify({ date: '2026-05-28', score: 3 }) }),
  )
  const body = await res.json()
  expect(body.triggers).toEqual([])
})

it('POST upserts an existing date instead of duplicating', async () => {
  const res = await POST(
    req('http://x/api/moods', { method: 'POST', body: JSON.stringify({ date: '2026-05-26', score: 1 }) }),
  )
  const body = await res.json()
  expect(body.id).toBe('m2')
  expect(body.score).toBe(1)
  const list = await (await GET(req('http://x/api/moods'))).json()
  expect(list.entries.length).toBe(3)
})

it('POST without a date returns 400', async () => {
  const res = await POST(req('http://x/api/moods', { method: 'POST', body: JSON.stringify({ score: 3 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'date required' })
})

it('POST with an out-of-range score returns 400', async () => {
  const res = await POST(
    req('http://x/api/moods', { method: 'POST', body: JSON.stringify({ date: '2026-05-28', score: 9 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'score invalid' })
})

it('POST with a non-numeric score returns 400', async () => {
  const res = await POST(
    req('http://x/api/moods', { method: 'POST', body: JSON.stringify({ date: '2026-05-28', score: 'x' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'score invalid' })
})

it('DELETE removes an entry', async () => {
  const del = await DELETE(req('http://x/api/moods?id=m1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const list = await (await GET(req('http://x/api/moods'))).json()
  expect(list.entries.map((e: { id: string }) => e.id)).toEqual(['m2', 'm3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/moods?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
