import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/chats/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded chats', async () => {
  const res = await GET(req('http://x/api/chats'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.chats.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2', 'c3'])
})

it('GET filters by open status', async () => {
  const res = await GET(req('http://x/api/chats?status=open'))
  const body = await res.json()
  expect(body.chats.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2'])
})

it('GET filters by closed status', async () => {
  const res = await GET(req('http://x/api/chats?status=closed'))
  const body = await res.json()
  expect(body.chats.map((c: { id: string }) => c.id)).toEqual(['c3'])
})

it('POST creates a chat and returns 201', async () => {
  const res = await POST(
    req('http://x/api/chats', { method: 'POST', body: JSON.stringify({ customer: 'Dan' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.customer).toBe('Dan')
  expect(body.status).toBe('open')
  expect(body.agentId).toBe(null)
  expect(body.id).toBe('c4')
})

it('POST without customer returns 400', async () => {
  const res = await POST(req('http://x/api/chats', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'customer required' })
})

it('PUT updates the chat status', async () => {
  const res = await PUT(
    req('http://x/api/chats?id=c1', { method: 'PUT', body: JSON.stringify({ status: 'closed' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('closed')
})

it('PUT assigns an agent', async () => {
  const res = await PUT(
    req('http://x/api/chats?id=c2', { method: 'PUT', body: JSON.stringify({ agentId: 'a2' }) }),
  )
  const body = await res.json()
  expect(body.agentId).toBe('a2')
})

it('PUT can clear the agent with null', async () => {
  const res = await PUT(
    req('http://x/api/chats?id=c1', { method: 'PUT', body: JSON.stringify({ agentId: null }) }),
  )
  const body = await res.json()
  expect(body.agentId).toBe(null)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/chats?id=nope', { method: 'PUT', body: JSON.stringify({ status: 'closed' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a chat', async () => {
  const del = await DELETE(req('http://x/api/chats?id=c1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/chats'))
  const body = await res.json()
  expect(body.chats.map((c: { id: string }) => c.id)).toEqual(['c2', 'c3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/chats?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
