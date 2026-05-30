import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/reviews/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded reviews', async () => {
  const res = await GET(req('http://x/api/reviews'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.reviews.map((r: { id: string }) => r.id)).toEqual(['r1', 'r2', 'r3'])
})

it('GET filters by productId', async () => {
  const res = await GET(req('http://x/api/reviews?productId=p1'))
  const body = await res.json()
  expect(body.reviews.map((r: { id: string }) => r.id)).toEqual(['r1', 'r2'])
})

it('GET sorts by rating descending', async () => {
  const res = await GET(req('http://x/api/reviews?productId=p1&sort=rating'))
  const body = await res.json()
  expect(body.reviews.map((r: { rating: number }) => r.rating)).toEqual([5, 3])
})

it('GET sorts by date descending', async () => {
  const res = await GET(req('http://x/api/reviews?sort=date'))
  const body = await res.json()
  expect(body.reviews.map((r: { id: string }) => r.id)).toEqual(['r3', 'r2', 'r1'])
})

it('POST creates a review and returns 201', async () => {
  const res = await POST(
    req('http://x/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId: 'p2', rating: 4, text: 'Solid' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('r4')
  expect(body.rating).toBe(4)
  expect(body.text).toBe('Solid')
})

it('POST with an out-of-range rating returns 400', async () => {
  const res = await POST(
    req('http://x/api/reviews', { method: 'POST', body: JSON.stringify({ productId: 'p1', rating: 9, text: 'hi' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'rating 1-5 required' })
})

it('POST with blank text returns 400', async () => {
  const res = await POST(
    req('http://x/api/reviews', { method: 'POST', body: JSON.stringify({ productId: 'p1', rating: 3, text: '  ' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'text required' })
})

it('DELETE removes a review', async () => {
  const del = await DELETE(req('http://x/api/reviews?id=r1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/reviews'))
  const body = await res.json()
  expect(body.reviews.map((r: { id: string }) => r.id)).toEqual(['r2', 'r3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/reviews?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
