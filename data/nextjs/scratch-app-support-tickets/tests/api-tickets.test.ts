import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/tickets/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded tickets', async () => {
  const res = await GET(req('http://x/api/tickets'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.tickets.map((t: { id: string }) => t.id)).toEqual(['k1', 'k2', 'k3', 'k4'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/tickets?status=open'))
  const body = await res.json()
  expect(body.tickets.map((t: { id: string }) => t.id)).toEqual(['k1', 'k3'])
})

it('GET filters by priority', async () => {
  const res = await GET(req('http://x/api/tickets?priority=urgent'))
  const body = await res.json()
  expect(body.tickets.map((t: { id: string }) => t.id)).toEqual(['k4'])
})

it('GET filters by unassigned', async () => {
  const res = await GET(req('http://x/api/tickets?assignee=unassigned'))
  const body = await res.json()
  expect(body.tickets.map((t: { id: string }) => t.id)).toEqual(['k2'])
})

it('POST creates a ticket and returns 201', async () => {
  const res = await POST(
    req('http://x/api/tickets', {
      method: 'POST',
      body: JSON.stringify({ subject: 'New issue', requester: 'ian', priority: 'high' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.subject).toBe('New issue')
  expect(body.requester).toBe('ian')
  expect(body.priority).toBe('high')
  expect(body.status).toBe('open')
  expect(body.assignee).toBe(null)
  expect(body.id).toBe('k5')
})

it('POST without a subject returns 400', async () => {
  const res = await POST(
    req('http://x/api/tickets', { method: 'POST', body: JSON.stringify({ requester: 'ian' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'subject required' })
})

it('PUT assigns a ticket', async () => {
  const res = await PUT(
    req('http://x/api/tickets?id=k2', { method: 'PUT', body: JSON.stringify({ assignee: 'bob' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.assignee).toBe('bob')
})

it('PUT unassigns a ticket with null', async () => {
  const res = await PUT(
    req('http://x/api/tickets?id=k1', { method: 'PUT', body: JSON.stringify({ assignee: null }) }),
  )
  const body = await res.json()
  expect(body.assignee).toBe(null)
})

it('PUT updates the status', async () => {
  const res = await PUT(
    req('http://x/api/tickets?id=k1', { method: 'PUT', body: JSON.stringify({ status: 'resolved' }) }),
  )
  const body = await res.json()
  expect(body.status).toBe('resolved')
})

it('PUT appends a reply', async () => {
  const res = await PUT(
    req('http://x/api/tickets?id=k2', {
      method: 'PUT',
      body: JSON.stringify({ replyBody: 'On it', author: 'bob' }),
    }),
  )
  const body = await res.json()
  expect(body.replies.length).toBe(1)
  expect(body.replies[0].body).toBe('On it')
  expect(body.replies[0].author).toBe('bob')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/tickets?id=nope', { method: 'PUT', body: JSON.stringify({ status: 'open' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a ticket', async () => {
  const del = await DELETE(req('http://x/api/tickets?id=k1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/tickets'))
  const body = await res.json()
  expect(body.tickets.map((t: { id: string }) => t.id)).toEqual(['k2', 'k3', 'k4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/tickets?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
