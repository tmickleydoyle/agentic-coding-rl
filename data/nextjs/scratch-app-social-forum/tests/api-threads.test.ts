import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/threads/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded threads in insertion order', async () => {
  const res = await GET(req('http://x/api/threads'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.threads.map((t: { id: string }) => t.id)).toEqual(['t1', 't2', 't3'])
})

it('GET sorts by votes descending', async () => {
  const res = await GET(req('http://x/api/threads?sort=votes'))
  const body = await res.json()
  expect(body.threads.map((t: { id: string }) => t.id)).toEqual(['t3', 't1', 't2'])
})

it('GET sorts by recent descending', async () => {
  const res = await GET(req('http://x/api/threads?sort=recent'))
  const body = await res.json()
  expect(body.threads.map((t: { id: string }) => t.id)).toEqual(['t3', 't2', 't1'])
})

it('GET filters by categoryId', async () => {
  const res = await GET(req('http://x/api/threads?categoryId=g2'))
  const body = await res.json()
  expect(body.threads.map((t: { id: string }) => t.id)).toEqual(['t2'])
})

it('POST creates a thread and returns 201', async () => {
  const res = await POST(
    req('http://x/api/threads', { method: 'POST', body: JSON.stringify({ title: 'New topic', categoryId: 'g2' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('New topic')
  expect(body.categoryId).toBe('g2')
  expect(body.votes).toBe(0)
  expect(body.id).toBe('t4')
})

it('POST defaults categoryId to g1', async () => {
  const res = await POST(
    req('http://x/api/threads', { method: 'POST', body: JSON.stringify({ title: 'Default cat' }) }),
  )
  const body = await res.json()
  expect(body.categoryId).toBe('g1')
})

it('POST without a title returns 400', async () => {
  const res = await POST(
    req('http://x/api/threads', { method: 'POST', body: JSON.stringify({ categoryId: 'g1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT upvotes a thread', async () => {
  const res = await PUT(req('http://x/api/threads?id=t1', { method: 'PUT' }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('t1')
  expect(body.votes).toBe(6)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/threads?id=nope', { method: 'PUT' }))
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

it('a created thread then appears in GET', async () => {
  await POST(req('http://x/api/threads', { method: 'POST', body: JSON.stringify({ title: 'Appears' }) }))
  const res = await GET(req('http://x/api/threads'))
  const body = await res.json()
  expect(body.threads.map((t: { title: string }) => t.title)).toContain('Appears')
})
