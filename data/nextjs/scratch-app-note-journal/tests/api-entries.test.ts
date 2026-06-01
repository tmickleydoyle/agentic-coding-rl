import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/entries/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded entries', async () => {
  const res = await GET(req('http://x/api/entries'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['e1', 'e2', 'e3'])
})

it('GET filters by mood', async () => {
  const res = await GET(req('http://x/api/entries?mood=happy'))
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['e1'])
})

it('GET filters by date', async () => {
  const res = await GET(req('http://x/api/entries?date=2026-05-28'))
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['e2', 'e3'])
})

it('GET with summary=1 returns mood tallies', async () => {
  const res = await GET(req('http://x/api/entries?summary=1'))
  const body = await res.json()
  expect(body.summary).toEqual({ happy: 1, neutral: 1, sad: 1, total: 3 })
})

it('POST creates an entry and returns 201', async () => {
  const res = await POST(
    req('http://x/api/entries', {
      method: 'POST',
      body: JSON.stringify({ body: 'New day', mood: 'happy', date: '2026-05-30' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.body).toBe('New day')
  expect(body.mood).toBe('happy')
  expect(body.date).toBe('2026-05-30')
  expect(body.id).toBe('e4')
})

it('POST defaults mood to neutral and date to today', async () => {
  const res = await POST(
    req('http://x/api/entries', { method: 'POST', body: JSON.stringify({ body: 'Plain' }) }),
  )
  const body = await res.json()
  expect(body.mood).toBe('neutral')
  expect(body.date).toBe('2026-05-29')
})

it('POST without a body returns 400', async () => {
  const res = await POST(req('http://x/api/entries', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'body required' })
})

it('PUT patches the mood', async () => {
  const res = await PUT(
    req('http://x/api/entries?id=e1', { method: 'PUT', body: JSON.stringify({ mood: 'sad' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.mood).toBe('sad')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/entries?id=nope', { method: 'PUT', body: JSON.stringify({ mood: 'sad' }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes an entry', async () => {
  const del = await DELETE(req('http://x/api/entries?id=e1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/entries'))
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['e2', 'e3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/entries?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
