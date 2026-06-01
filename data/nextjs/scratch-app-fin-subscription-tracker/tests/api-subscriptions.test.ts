import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/subscriptions/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded subscriptions', async () => {
  const res = await GET(req('http://x/api/subscriptions'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.subscriptions.map((s: { id: string }) => s.id)).toEqual(['s1', 's2', 's3', 's4'])
})

it('GET filters by active=true', async () => {
  const res = await GET(req('http://x/api/subscriptions?active=true'))
  const body = await res.json()
  expect(body.subscriptions.map((s: { id: string }) => s.id)).toEqual(['s1', 's2', 's3'])
})

it('GET filters by active=false', async () => {
  const res = await GET(req('http://x/api/subscriptions?active=false'))
  const body = await res.json()
  expect(body.subscriptions.map((s: { id: string }) => s.id)).toEqual(['s4'])
})

it('POST creates a subscription and returns 201', async () => {
  const res = await POST(
    req('http://x/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ name: 'Disney', cost: 8, cycle: 'monthly', nextRenewal: '2026-07-10' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Disney')
  expect(body.active).toBe(true)
  expect(body.id).toBe('s5')
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ cost: 8, cycle: 'monthly', nextRenewal: '2026-07-10' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST with a non-positive cost returns 400', async () => {
  const res = await POST(
    req('http://x/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ name: 'Bad', cost: 0, cycle: 'monthly', nextRenewal: '2026-07-10' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'cost must be positive' })
})

it('POST without a renewal date returns 400', async () => {
  const res = await POST(
    req('http://x/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ name: 'NoDate', cost: 5, cycle: 'monthly' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'nextRenewal required' })
})

it('PUT cancels a subscription', async () => {
  const res = await PUT(req('http://x/api/subscriptions?id=s1', { method: 'PUT' }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('s1')
  expect(body.active).toBe(false)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/subscriptions?id=nope', { method: 'PUT' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a subscription', async () => {
  const del = await DELETE(req('http://x/api/subscriptions?id=s2', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/subscriptions'))
  const body = await res.json()
  expect(body.subscriptions.map((s: { id: string }) => s.id)).toEqual(['s1', 's3', 's4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/subscriptions?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
