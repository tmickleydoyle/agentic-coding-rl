import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/notes/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded notes', async () => {
  const res = await GET(req('http://x/api/notes'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.notes.map((n: { id: string }) => n.id)).toEqual(['m1', 'm2', 'm3'])
})

it('GET filters by tag', async () => {
  const res = await GET(req('http://x/api/notes?tag=intro'))
  const body = await res.json()
  expect(body.notes.map((n: { id: string }) => n.id)).toEqual(['m1', 'm3'])
})

it('GET filters by q across title and body', async () => {
  const res = await GET(req('http://x/api/notes?q=bold'))
  const body = await res.json()
  expect(body.notes.map((n: { id: string }) => n.id)).toEqual(['m1'])
})

it('GET with render=html attaches rendered html', async () => {
  const res = await GET(req('http://x/api/notes?tag=intro&render=html'))
  const body = await res.json()
  const m1 = body.notes.find((n: { id: string }) => n.id === 'm1')
  expect(m1.html).toContain('<h1>Hello</h1>')
  expect(m1.html).toContain('<strong>bold</strong>')
})

it('POST creates a note and returns 201', async () => {
  const res = await POST(
    req('http://x/api/notes', {
      method: 'POST',
      body: JSON.stringify({ title: 'Made', body: 'hi there', tags: ['z'] }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('Made')
  expect(body.tags).toEqual(['z'])
  expect(body.id).toBe('m4')
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/notes', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT patches a note', async () => {
  const res = await PUT(
    req('http://x/api/notes?id=m1', { method: 'PUT', body: JSON.stringify({ title: 'Hi' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.title).toBe('Hi')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/notes?id=nope', { method: 'PUT', body: JSON.stringify({ title: 'x' }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a note', async () => {
  const del = await DELETE(req('http://x/api/notes?id=m2', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/notes'))
  const body = await res.json()
  expect(body.notes.map((n: { id: string }) => n.id)).toEqual(['m1', 'm3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/notes?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
