import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/messages/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded messages', async () => {
  const res = await GET(req('http://x/api/messages'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.messages.map((m: { id: string }) => m.id)).toEqual(['m1', 'm2', 'm3'])
})

it('GET filters to resolved messages', async () => {
  const res = await GET(req('http://x/api/messages?resolved=true'))
  const body = await res.json()
  expect(body.messages.map((m: { id: string }) => m.id)).toEqual(['m3'])
})

it('GET filters to open messages', async () => {
  const res = await GET(req('http://x/api/messages?resolved=false'))
  const body = await res.json()
  expect(body.messages.map((m: { id: string }) => m.id)).toEqual(['m1', 'm2'])
})

it('POST creates a message and returns 201', async () => {
  const res = await POST(
    req('http://x/api/messages', {
      method: 'POST',
      body: JSON.stringify({ authorId: 'u1', text: 'New thread' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.text).toBe('New thread')
  expect(body.authorId).toBe('u1')
  expect(body.resolved).toBe(false)
  expect(body.id).toBe('m4')
})

it('POST without authorId returns 400', async () => {
  const res = await POST(
    req('http://x/api/messages', { method: 'POST', body: JSON.stringify({ text: 'Hi' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'authorId required' })
})

it('POST without text returns 400', async () => {
  const res = await POST(
    req('http://x/api/messages', { method: 'POST', body: JSON.stringify({ authorId: 'u1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'text required' })
})

it('PUT toggles resolved when no explicit value given', async () => {
  const res = await PUT(
    req('http://x/api/messages?id=m1', { method: 'PUT', body: JSON.stringify({}) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.resolved).toBe(true)
})

it('PUT sets resolved explicitly', async () => {
  const res = await PUT(
    req('http://x/api/messages?id=m3', { method: 'PUT', body: JSON.stringify({ resolved: false }) }),
  )
  const body = await res.json()
  expect(body.resolved).toBe(false)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/messages?id=nope', { method: 'PUT', body: JSON.stringify({}) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a message', async () => {
  const del = await DELETE(req('http://x/api/messages?id=m1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/messages'))
  const body = await res.json()
  expect(body.messages.map((m: { id: string }) => m.id)).toEqual(['m2', 'm3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/messages?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
