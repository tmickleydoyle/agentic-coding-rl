import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/sessions/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded sessions', async () => {
  const res = await GET(req('http://x/api/sessions'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.sessions.map((s: { id: string }) => s.id)).toEqual(['s1', 's2', 's3', 's4', 's5'])
})

it('GET filters by status waiting', async () => {
  const res = await GET(req('http://x/api/sessions?status=waiting'))
  const body = await res.json()
  expect(body.sessions.map((s: { id: string }) => s.id)).toEqual(['s1', 's4'])
})

it('GET filters by status closed', async () => {
  const res = await GET(req('http://x/api/sessions?status=closed'))
  const body = await res.json()
  expect(body.sessions.map((s: { id: string }) => s.id)).toEqual(['s3'])
})

it('POST creates a waiting session and returns 201', async () => {
  const res = await POST(
    req('http://x/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ visitor: 'ian', topic: 'Login issue' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.visitor).toBe('ian')
  expect(body.status).toBe('waiting')
  expect(body.agent).toBe(null)
  expect(body.id).toBe('s6')
})

it('POST without a visitor returns 400', async () => {
  const res = await POST(
    req('http://x/api/sessions', { method: 'POST', body: JSON.stringify({ topic: 'x' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'visitor required' })
})

it('PUT assign sets the agent and activates the session', async () => {
  const res = await PUT(
    req('http://x/api/sessions?id=s1', {
      method: 'PUT',
      body: JSON.stringify({ action: 'assign', agent: 'bob' }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.agent).toBe('bob')
  expect(body.status).toBe('active')
})

it('PUT assign without an agent returns 400', async () => {
  const res = await PUT(
    req('http://x/api/sessions?id=s1', { method: 'PUT', body: JSON.stringify({ action: 'assign' }) }),
  )
  expect(res.status).toBe(400)
})

it('PUT close sets the status to closed', async () => {
  const res = await PUT(
    req('http://x/api/sessions?id=s2', { method: 'PUT', body: JSON.stringify({ action: 'close' }) }),
  )
  const body = await res.json()
  expect(body.status).toBe('closed')
})

it('PUT message appends to the transcript', async () => {
  const res = await PUT(
    req('http://x/api/sessions?id=s4', {
      method: 'PUT',
      body: JSON.stringify({ action: 'message', from: 'agent', text: 'Hi!' }),
    }),
  )
  const body = await res.json()
  expect(body.messages.length).toBe(1)
  expect(body.messages[0].from).toBe('agent')
  expect(body.messages[0].text).toBe('Hi!')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/sessions?id=nope', { method: 'PUT', body: JSON.stringify({ action: 'close' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a session', async () => {
  const del = await DELETE(req('http://x/api/sessions?id=s1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/sessions'))
  const body = await res.json()
  expect(body.sessions.map((s: { id: string }) => s.id)).toEqual(['s2', 's3', 's4', 's5'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/sessions?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
