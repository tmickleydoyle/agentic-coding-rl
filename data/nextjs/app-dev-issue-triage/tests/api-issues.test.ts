import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/issues/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded issues', async () => {
  const res = await GET(req('http://x/api/issues'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.issues.map((i: { id: string }) => i.id)).toEqual(['i1', 'i2', 'i3', 'i4'])
})

it('GET filters by label', async () => {
  const res = await GET(req('http://x/api/issues?label=perf'))
  const body = await res.json()
  expect(body.issues.map((i: { id: string }) => i.id)).toEqual(['i2'])
})

it('GET filters by priority', async () => {
  const res = await GET(req('http://x/api/issues?priority=low'))
  const body = await res.json()
  expect(body.issues.map((i: { id: string }) => i.id)).toEqual(['i3', 'i4'])
})

it('GET filters by unassigned', async () => {
  const res = await GET(req('http://x/api/issues?assignee=unassigned'))
  const body = await res.json()
  expect(body.issues.map((i: { id: string }) => i.id)).toEqual(['i2', 'i4'])
})

it('GET filters by a specific assignee', async () => {
  const res = await GET(req('http://x/api/issues?assignee=bob'))
  const body = await res.json()
  expect(body.issues.map((i: { id: string }) => i.id)).toEqual(['i3'])
})

it('GET combines label and priority filters', async () => {
  const res = await GET(req('http://x/api/issues?label=ui&priority=low'))
  const body = await res.json()
  expect(body.issues.map((i: { id: string }) => i.id)).toEqual(['i3', 'i4'])
})

it('POST creates an issue with defaults and returns 201', async () => {
  const res = await POST(
    req('http://x/api/issues', { method: 'POST', body: JSON.stringify({ title: 'Crash on save' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('i5')
  expect(body.title).toBe('Crash on save')
  expect(body.priority).toBe('medium')
  expect(body.status).toBe('open')
  expect(body.assignee).toBe(null)
  expect(body.labels).toEqual([])
})

it('POST honors provided labels and priority', async () => {
  const res = await POST(
    req('http://x/api/issues', {
      method: 'POST',
      body: JSON.stringify({ title: 'New bug', labels: ['bug'], priority: 'high', assignee: 'eve' }),
    }),
  )
  const body = await res.json()
  expect(body.labels).toEqual(['bug'])
  expect(body.priority).toBe('high')
  expect(body.assignee).toBe('eve')
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/issues', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT assigns an issue', async () => {
  const res = await PUT(
    req('http://x/api/issues?id=i2', { method: 'PUT', body: JSON.stringify({ assignee: 'frank' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.assignee).toBe('frank')
})

it('PUT can unassign with null', async () => {
  const res = await PUT(
    req('http://x/api/issues?id=i1', { method: 'PUT', body: JSON.stringify({ assignee: null }) }),
  )
  const body = await res.json()
  expect(body.assignee).toBe(null)
})

it('PUT updates status', async () => {
  const res = await PUT(
    req('http://x/api/issues?id=i1', { method: 'PUT', body: JSON.stringify({ status: 'closed' }) }),
  )
  const body = await res.json()
  expect(body.status).toBe('closed')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/issues?id=nope', { method: 'PUT', body: JSON.stringify({ status: 'closed' }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes an issue', async () => {
  const del = await DELETE(req('http://x/api/issues?id=i1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/issues'))
  const body = await res.json()
  expect(body.issues.map((i: { id: string }) => i.id)).toEqual(['i2', 'i3', 'i4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/issues?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
