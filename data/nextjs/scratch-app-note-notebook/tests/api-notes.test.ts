import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/notes/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded notes', async () => {
  const res = await GET(req('http://x/api/notes'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.notes.map((n: { id: string }) => n.id)).toEqual(['n1', 'n2', 'n3'])
})

it('GET filters by notebookId', async () => {
  const res = await GET(req('http://x/api/notes?notebookId=nb1'))
  const body = await res.json()
  expect(body.notes.map((n: { id: string }) => n.id)).toEqual(['n1', 'n3'])
})

it('GET filters by tag', async () => {
  const res = await GET(req('http://x/api/notes?tag=fun'))
  const body = await res.json()
  expect(body.notes.map((n: { id: string }) => n.id)).toEqual(['n3'])
})

it('GET filters by q across title and body (case-insensitive)', async () => {
  const res = await GET(req('http://x/api/notes?q=EDITOR'))
  const body = await res.json()
  expect(body.notes.map((n: { id: string }) => n.id)).toEqual(['n2'])
})

it('POST creates a note and returns 201', async () => {
  const res = await POST(
    req('http://x/api/notes', {
      method: 'POST',
      body: JSON.stringify({ notebookId: 'nb2', title: 'New note', body: 'hi', tags: ['x'] }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('New note')
  expect(body.notebookId).toBe('nb2')
  expect(body.tags).toEqual(['x'])
  expect(body.pinned).toBe(false)
  expect(body.id).toBe('n4')
})

it('POST without a title returns 400', async () => {
  const res = await POST(
    req('http://x/api/notes', { method: 'POST', body: JSON.stringify({ notebookId: 'nb1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT patches fields explicitly', async () => {
  const res = await PUT(
    req('http://x/api/notes?id=n1', { method: 'PUT', body: JSON.stringify({ title: 'Renamed' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.title).toBe('Renamed')
})

it('PUT toggles pinned when the body is empty', async () => {
  const res = await PUT(req('http://x/api/notes?id=n1', { method: 'PUT', body: JSON.stringify({}) }))
  const body = await res.json()
  expect(body.pinned).toBe(true)
})

it('PUT sets pinned explicitly', async () => {
  const res = await PUT(
    req('http://x/api/notes?id=n2', { method: 'PUT', body: JSON.stringify({ pinned: false }) }),
  )
  const body = await res.json()
  expect(body.pinned).toBe(false)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/notes?id=nope', { method: 'PUT', body: JSON.stringify({ title: 'x' }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a note', async () => {
  const del = await DELETE(req('http://x/api/notes?id=n1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/notes'))
  const body = await res.json()
  expect(body.notes.map((n: { id: string }) => n.id)).toEqual(['n2', 'n3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/notes?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('a created note then appears in GET', async () => {
  await POST(
    req('http://x/api/notes', { method: 'POST', body: JSON.stringify({ notebookId: 'nb1', title: 'Later' }) }),
  )
  const res = await GET(req('http://x/api/notes'))
  const body = await res.json()
  expect(body.notes.map((n: { title: string }) => n.title)).toContain('Later')
})
