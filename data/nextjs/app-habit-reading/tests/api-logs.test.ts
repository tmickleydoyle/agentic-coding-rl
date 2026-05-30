import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/logs/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists logs and books', async () => {
  const res = await GET(req('http://x/api/logs'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.logs.map((l: { id: string }) => l.id)).toEqual(['l1', 'l2', 'l3'])
  expect(body.books.map((b: { id: string }) => b.id)).toEqual(['b1', 'b2', 'b3'])
})

it('POST creates a log for a new date with id l4', async () => {
  const res = await POST(
    req('http://x/api/logs', { method: 'POST', body: JSON.stringify({ date: '2026-05-29', pages: 12 }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('l4')
  expect(body.pages).toBe(12)
})

it('POST upserts an existing date instead of duplicating', async () => {
  const res = await POST(
    req('http://x/api/logs', { method: 'POST', body: JSON.stringify({ date: '2026-05-27', pages: 99 }) }),
  )
  const body = await res.json()
  expect(body.id).toBe('l2')
  expect(body.pages).toBe(99)
  const list = await (await GET(req('http://x/api/logs'))).json()
  expect(list.logs.length).toBe(3)
})

it('POST without a date returns 400', async () => {
  const res = await POST(req('http://x/api/logs', { method: 'POST', body: JSON.stringify({ pages: 5 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'date required' })
})

it('POST with negative pages returns 400', async () => {
  const res = await POST(
    req('http://x/api/logs', { method: 'POST', body: JSON.stringify({ date: '2026-05-29', pages: -3 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'pages invalid' })
})

it('PUT toggles a book done flag', async () => {
  const res = await PUT(req('http://x/api/logs', { method: 'PUT', body: JSON.stringify({ id: 'b2' }) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.done).toBe(true)
})

it('PUT on a missing book returns 404', async () => {
  const res = await PUT(req('http://x/api/logs', { method: 'PUT', body: JSON.stringify({ id: 'nope' }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a log', async () => {
  const del = await DELETE(req('http://x/api/logs?id=l1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const list = await (await GET(req('http://x/api/logs'))).json()
  expect(list.logs.map((l: { id: string }) => l.id)).toEqual(['l2', 'l3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/logs?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
