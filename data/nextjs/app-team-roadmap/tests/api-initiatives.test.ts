import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/initiatives/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded initiatives', async () => {
  const res = await GET(req('http://x/api/initiatives'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.initiatives.map((i: { id: string }) => i.id)).toEqual(['i1', 'i2', 'i3'])
})

it('GET filters by quarterId', async () => {
  const res = await GET(req('http://x/api/initiatives?quarterId=q1'))
  const body = await res.json()
  expect(body.initiatives.map((i: { id: string }) => i.id)).toEqual(['i1', 'i2'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/initiatives?status=done'))
  const body = await res.json()
  expect(body.initiatives.map((i: { id: string }) => i.id)).toEqual(['i3'])
})

it('GET combines quarterId and status', async () => {
  const res = await GET(req('http://x/api/initiatives?quarterId=q1&status=planned'))
  const body = await res.json()
  expect(body.initiatives.map((i: { id: string }) => i.id)).toEqual(['i2'])
})

it('POST creates a planned initiative and returns 201', async () => {
  const res = await POST(
    req('http://x/api/initiatives', { method: 'POST', body: JSON.stringify({ title: 'Search', quarterId: 'q4' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('i4')
  expect(body.title).toBe('Search')
  expect(body.quarterId).toBe('q4')
  expect(body.status).toBe('planned')
})

it('POST without a title returns 400', async () => {
  const res = await POST(
    req('http://x/api/initiatives', { method: 'POST', body: JSON.stringify({ quarterId: 'q1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT moves an initiative to another quarter', async () => {
  const res = await PUT(
    req('http://x/api/initiatives?id=i1', { method: 'PUT', body: JSON.stringify({ quarterId: 'q3' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.quarterId).toBe('q3')
})

it('PUT updates the status', async () => {
  const res = await PUT(
    req('http://x/api/initiatives?id=i2', { method: 'PUT', body: JSON.stringify({ status: 'in-progress' }) }),
  )
  const body = await res.json()
  expect(body.status).toBe('in-progress')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/initiatives?id=nope', { method: 'PUT', body: JSON.stringify({ status: 'done' }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes an initiative', async () => {
  const del = await DELETE(req('http://x/api/initiatives?id=i1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/initiatives'))
  const body = await res.json()
  expect(body.initiatives.map((i: { id: string }) => i.id)).toEqual(['i2', 'i3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/initiatives?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
