import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/entries/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists entries with totals and week total', async () => {
  const res = await GET(req('http://x/api/entries'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['h1', 'h2', 'h3'])
  expect(body.totalsByProject.p1).toBe(7)
  expect(body.totalsByProject.p2).toBe(5)
  expect(body.totalsByProject.p3).toBe(0)
  expect(body.weekTotal).toBe(12)
})

it('GET filters by projectId but keeps totals over all entries', async () => {
  const res = await GET(req('http://x/api/entries?projectId=p1'))
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['h1', 'h2'])
  expect(body.weekTotal).toBe(12)
})

it('GET filters by day', async () => {
  const res = await GET(req('http://x/api/entries?day=mon'))
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['h1', 'h3'])
})

it('POST creates an unsubmitted entry and returns 201', async () => {
  const res = await POST(
    req('http://x/api/entries', { method: 'POST', body: JSON.stringify({ projectId: 'p3', day: 'wed', hours: 6 }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('h4')
  expect(body.projectId).toBe('p3')
  expect(body.day).toBe('wed')
  expect(body.hours).toBe(6)
  expect(body.submitted).toBe(false)
})

it('POST clamps negative hours to zero', async () => {
  const res = await POST(
    req('http://x/api/entries', { method: 'POST', body: JSON.stringify({ projectId: 'p1', day: 'mon', hours: -3 }) }),
  )
  const body = await res.json()
  expect(body.hours).toBe(0)
})

it('POST without hours returns 400', async () => {
  const res = await POST(
    req('http://x/api/entries', { method: 'POST', body: JSON.stringify({ projectId: 'p1', day: 'mon' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'hours required' })
})

it('a created entry updates the totals in a later GET', async () => {
  await POST(req('http://x/api/entries', { method: 'POST', body: JSON.stringify({ projectId: 'p1', day: 'wed', hours: 2 }) }))
  const res = await GET(req('http://x/api/entries'))
  const body = await res.json()
  expect(body.totalsByProject.p1).toBe(9)
  expect(body.weekTotal).toBe(14)
})

it('PUT submits an entry', async () => {
  const res = await PUT(req('http://x/api/entries?id=h1', { method: 'PUT' }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('h1')
  expect(body.submitted).toBe(true)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/entries?id=nope', { method: 'PUT' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes an entry and updates totals', async () => {
  const del = await DELETE(req('http://x/api/entries?id=h1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/entries'))
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['h2', 'h3'])
  expect(body.weekTotal).toBe(8)
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/entries?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
