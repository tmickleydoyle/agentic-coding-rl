import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/subscribers/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded subscribers', async () => {
  const res = await GET(req('http://x/api/subscribers'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.subscribers.map((s: { id: string }) => s.id)).toEqual(['s1', 's2', 's3'])
})

it('GET filters by active=true', async () => {
  const res = await GET(req('http://x/api/subscribers?active=true'))
  const body = await res.json()
  expect(body.subscribers.map((s: { id: string }) => s.id)).toEqual(['s1', 's2'])
})

it('POST creates an active subscriber and returns 201', async () => {
  const res = await POST(
    req('http://x/api/subscribers', { method: 'POST', body: JSON.stringify({ email: 'new@example.com' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.email).toBe('new@example.com')
  expect(body.active).toBe(true)
  expect(body.id).toBe('s4')
})

it('POST without an email returns 400', async () => {
  const res = await POST(req('http://x/api/subscribers', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'email required' })
})

it('POST with an invalid email returns 400', async () => {
  const res = await POST(
    req('http://x/api/subscribers', { method: 'POST', body: JSON.stringify({ email: 'nope' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid email' })
})

it('DELETE removes a subscriber', async () => {
  const del = await DELETE(req('http://x/api/subscribers?id=s3', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/subscribers'))
  const body = await res.json()
  expect(body.subscribers.map((s: { id: string }) => s.id)).toEqual(['s1', 's2'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/subscribers?id=zzz', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
