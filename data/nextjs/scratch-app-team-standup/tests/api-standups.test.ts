import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/standups/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded entries', async () => {
  const res = await GET(req('http://x/api/standups'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['e1', 'e2', 'e3'])
})

it('GET filters by date', async () => {
  const res = await GET(req('http://x/api/standups?date=2026-05-28'))
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['e1', 'e2'])
})

it('GET filters by memberId', async () => {
  const res = await GET(req('http://x/api/standups?memberId=m1'))
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['e1', 'e3'])
})

it('GET filters by blockers', async () => {
  const res = await GET(req('http://x/api/standups?blockers=true'))
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['e1'])
})

it('GET combines date and blockers filters', async () => {
  const res = await GET(req('http://x/api/standups?date=2026-05-29&blockers=true'))
  const body = await res.json()
  expect(body.entries).toEqual([])
})

it('POST creates an entry and returns 201', async () => {
  const res = await POST(
    req('http://x/api/standups', {
      method: 'POST',
      body: JSON.stringify({ memberId: 'm2', yesterday: 'A', today: 'B' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('e4')
  expect(body.memberId).toBe('m2')
  expect(body.date).toBe('2026-05-29')
  expect(body.blocker).toBeNull()
})

it('POST stores a non-blank blocker', async () => {
  const res = await POST(
    req('http://x/api/standups', {
      method: 'POST',
      body: JSON.stringify({ memberId: 'm1', yesterday: 'A', today: 'B', blocker: 'Stuck' }),
    }),
  )
  const body = await res.json()
  expect(body.blocker).toBe('Stuck')
})

it('POST treats a blank blocker as null', async () => {
  const res = await POST(
    req('http://x/api/standups', {
      method: 'POST',
      body: JSON.stringify({ memberId: 'm1', yesterday: 'A', today: 'B', blocker: '   ' }),
    }),
  )
  const body = await res.json()
  expect(body.blocker).toBeNull()
})

it('POST without yesterday/today returns 400', async () => {
  const res = await POST(
    req('http://x/api/standups', { method: 'POST', body: JSON.stringify({ memberId: 'm1', today: 'B' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'yesterday and today required' })
})

it('a created entry appears in GET', async () => {
  await POST(
    req('http://x/api/standups', {
      method: 'POST',
      body: JSON.stringify({ memberId: 'm3', yesterday: 'A', today: 'B' }),
    }),
  )
  const res = await GET(req('http://x/api/standups?memberId=m3'))
  const body = await res.json()
  expect(body.entries).toHaveLength(1)
})

it('DELETE removes an entry', async () => {
  const del = await DELETE(req('http://x/api/standups?id=e1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/standups'))
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['e2', 'e3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/standups?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
