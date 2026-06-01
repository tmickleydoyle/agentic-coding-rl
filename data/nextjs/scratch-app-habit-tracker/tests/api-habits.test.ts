import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/habits/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded habits', async () => {
  const res = await GET(req('http://x/api/habits'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.habits.map((h: { id: string }) => h.id)).toEqual(['h1', 'h2', 'h3'])
})

it('POST creates a habit and returns 201 with id h4', async () => {
  const res = await POST(
    req('http://x/api/habits', { method: 'POST', body: JSON.stringify({ name: 'Meditate' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('h4')
  expect(body.name).toBe('Meditate')
  expect(body.history).toEqual([])
})

it('POST trims the name', async () => {
  const res = await POST(
    req('http://x/api/habits', { method: 'POST', body: JSON.stringify({ name: '  Yoga  ' }) }),
  )
  const body = await res.json()
  expect(body.name).toBe('Yoga')
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/habits', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('PUT toggles a date on into a habit history', async () => {
  const res = await PUT(
    req('http://x/api/habits', { method: 'PUT', body: JSON.stringify({ id: 'h3', date: '2026-05-28' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.history).toContain('2026-05-28')
})

it('PUT toggles a date off when already present', async () => {
  const res = await PUT(
    req('http://x/api/habits', { method: 'PUT', body: JSON.stringify({ id: 'h1', date: '2026-05-28' }) }),
  )
  const body = await res.json()
  expect(body.history).not.toContain('2026-05-28')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/habits', { method: 'PUT', body: JSON.stringify({ id: 'nope', date: '2026-05-28' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('PUT without a date returns 400', async () => {
  const res = await PUT(
    req('http://x/api/habits', { method: 'PUT', body: JSON.stringify({ id: 'h1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'date required' })
})

it('DELETE removes a habit', async () => {
  const del = await DELETE(req('http://x/api/habits?id=h1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const list = await (await GET(req('http://x/api/habits'))).json()
  expect(list.habits.map((h: { id: string }) => h.id)).toEqual(['h2', 'h3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/habits?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
