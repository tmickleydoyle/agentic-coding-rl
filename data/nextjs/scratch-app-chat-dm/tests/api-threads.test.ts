import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/threads/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded threads', async () => {
  const res = await GET(req('http://x/api/threads'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.threads.map((t: { id: string }) => t.id)).toEqual(['t1', 't2', 't3'])
})

it('GET filters to unread threads', async () => {
  const res = await GET(req('http://x/api/threads?unread=true'))
  const body = await res.json()
  expect(body.threads.map((t: { id: string }) => t.id)).toEqual(['t1', 't3'])
})

it('POST creates a thread and returns 201', async () => {
  const res = await POST(
    req('http://x/api/threads', { method: 'POST', body: JSON.stringify({ personId: 'u3' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.personId).toBe('u3')
  expect(body.unread).toBe(false)
  expect(body.id).toBe('t4')
})

it('POST without personId returns 400', async () => {
  const res = await POST(
    req('http://x/api/threads', { method: 'POST', body: JSON.stringify({}) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'personId required' })
})

it('PUT toggles unread when no explicit value given', async () => {
  const res = await PUT(
    req('http://x/api/threads?id=t1', { method: 'PUT', body: JSON.stringify({}) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.unread).toBe(false)
})

it('PUT sets unread explicitly', async () => {
  const res = await PUT(
    req('http://x/api/threads?id=t2', { method: 'PUT', body: JSON.stringify({ unread: true }) }),
  )
  const body = await res.json()
  expect(body.unread).toBe(true)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/threads?id=nope', { method: 'PUT', body: JSON.stringify({}) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a thread', async () => {
  const del = await DELETE(req('http://x/api/threads?id=t1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/threads'))
  const body = await res.json()
  expect(body.threads.map((t: { id: string }) => t.id)).toEqual(['t2', 't3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/threads?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
