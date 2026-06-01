import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/quotes/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists quotes with computed totals', async () => {
  const res = await GET(req('http://x/api/quotes'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.quotes.map((q: { id: string }) => q.id)).toEqual(['q1', 'q2', 'q3'])
  const byId = Object.fromEntries(body.quotes.map((q: { id: string; total: number }) => [q.id, q.total]))
  expect(byId.q1).toBe(200)
  expect(byId.q2).toBe(600)
  expect(byId.q3).toBe(650)
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/quotes?status=accepted'))
  const body = await res.json()
  expect(body.quotes.map((q: { id: string }) => q.id)).toEqual(['q2'])
})

it('POST creates a draft quote with a total and returns 201', async () => {
  const res = await POST(
    req('http://x/api/quotes', {
      method: 'POST',
      body: JSON.stringify({
        client: 'Umbrella',
        items: [{ description: 'Consulting', qty: 4, price: 25 }],
      }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('q4')
  expect(body.status).toBe('draft')
  expect(body.total).toBe(100)
})

it('POST defaults items to an empty list (total 0)', async () => {
  const res = await POST(
    req('http://x/api/quotes', { method: 'POST', body: JSON.stringify({ client: 'Empty' }) }),
  )
  const body = await res.json()
  expect(body.items).toEqual([])
  expect(body.total).toBe(0)
})

it('POST without a client returns 400', async () => {
  const res = await POST(req('http://x/api/quotes', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'client required' })
})

it('PUT updates the status of a quote', async () => {
  const res = await PUT(
    req('http://x/api/quotes?id=q3', { method: 'PUT', body: JSON.stringify({ status: 'accepted' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('accepted')
  expect(body.total).toBe(650)
})

it('PUT with an invalid status returns 400', async () => {
  const res = await PUT(
    req('http://x/api/quotes?id=q1', { method: 'PUT', body: JSON.stringify({ status: 'maybe' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid status' })
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/quotes?id=nope', { method: 'PUT', body: JSON.stringify({ status: 'sent' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('a created quote then appears in GET', async () => {
  await POST(
    req('http://x/api/quotes', { method: 'POST', body: JSON.stringify({ client: 'Stark' }) }),
  )
  const res = await GET(req('http://x/api/quotes'))
  const body = await res.json()
  expect(body.quotes.map((q: { client: string }) => q.client)).toContain('Stark')
})
