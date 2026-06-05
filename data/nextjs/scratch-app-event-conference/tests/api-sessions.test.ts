import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/sessions/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded sessions', async () => {
  const res = await GET(req('http://x/api/sessions'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.sessions.map((s: { id: string }) => s.id)).toEqual(['s1', 's2', 's3', 's4'])
})

it('GET filters by track', async () => {
  const res = await GET(req('http://x/api/sessions?track=AI'))
  const body = await res.json()
  expect(body.sessions.map((s: { id: string }) => s.id)).toEqual(['s1', 's4'])
})

it('GET filters by slot', async () => {
  const res = await GET(req('http://x/api/sessions?slot=09:00'))
  const body = await res.json()
  expect(body.sessions.map((s: { id: string }) => s.id)).toEqual(['s1', 's3'])
})

it('GET combines track and slot filters with AND', async () => {
  const res = await GET(req('http://x/api/sessions?track=AI&slot=09:00'))
  const body = await res.json()
  expect(body.sessions.map((s: { id: string }) => s.id)).toEqual(['s1'])
})

it('POST creates a session and returns 201', async () => {
  const res = await POST(
    req('http://x/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ title: 'New', track: 'Web', slot: '13:00', speaker: 'Rob' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('s5')
  expect(body.title).toBe('New')
})

it('POST with a missing field returns 400', async () => {
  const res = await POST(
    req('http://x/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ title: 'New', track: 'Web', slot: '13:00' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid session' })
})

it('POST with a bad slot returns 422', async () => {
  const res = await POST(
    req('http://x/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ title: 'New', track: 'Web', slot: '23:00', speaker: 'Rob' }),
    }),
  )
  expect(res.status).toBe(422)
  expect(await res.json()).toEqual({ error: 'bad slot' })
})

it('DELETE removes a session', async () => {
  const del = await DELETE(req('http://x/api/sessions?id=s1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/sessions'))
  const body = await res.json()
  expect(body.sessions.map((s: { id: string }) => s.id)).toEqual(['s2', 's3', 's4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/sessions?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
