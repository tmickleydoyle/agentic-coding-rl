import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/entries/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists entries and the goal', async () => {
  const res = await GET(req('http://x/api/entries'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['g1', 'g2', 'g3'])
  expect(body.goal).toBe(75)
})

it('GET latest returns the most recent entry', async () => {
  const res = await GET(req('http://x/api/entries?latest'))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('g3')
  expect(body.weight).toBe(79)
})

it('POST creates an entry and returns 201', async () => {
  const res = await POST(
    req('http://x/api/entries', { method: 'POST', body: JSON.stringify({ date: '2026-05-22', weight: 78 }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('g4')
  expect(body.weight).toBe(78)
})

it('POST without a date returns 400', async () => {
  const res = await POST(req('http://x/api/entries', { method: 'POST', body: JSON.stringify({ weight: 78 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'date required' })
})

it('POST with an invalid weight returns 400', async () => {
  const res = await POST(
    req('http://x/api/entries', { method: 'POST', body: JSON.stringify({ date: '2026-05-22', weight: 0 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'weight invalid' })
})

it('PUT updates the goal', async () => {
  const res = await PUT(req('http://x/api/entries', { method: 'PUT', body: JSON.stringify({ goal: 70 }) }))
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ goal: 70 })
  const list = await (await GET(req('http://x/api/entries'))).json()
  expect(list.goal).toBe(70)
})

it('PUT with an invalid goal returns 400', async () => {
  const res = await PUT(req('http://x/api/entries', { method: 'PUT', body: JSON.stringify({ goal: -1 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'goal invalid' })
})

it('DELETE removes an entry', async () => {
  const del = await DELETE(req('http://x/api/entries?id=g1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const list = await (await GET(req('http://x/api/entries'))).json()
  expect(list.entries.map((e: { id: string }) => e.id)).toEqual(['g2', 'g3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/entries?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
