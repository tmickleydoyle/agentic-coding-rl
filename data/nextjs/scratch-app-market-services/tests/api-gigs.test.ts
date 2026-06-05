import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/gigs/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded gigs', async () => {
  const res = await GET(req('http://x/api/gigs'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.gigs.map((g: { id: string }) => g.id)).toEqual(['g1', 'g2', 'g3'])
})

it('GET filters by category', async () => {
  const res = await GET(req('http://x/api/gigs?category=dev'))
  const body = await res.json()
  expect(body.gigs.map((g: { id: string }) => g.id)).toEqual(['g3'])
})

it('POST creates a gig and returns 201', async () => {
  const res = await POST(
    req('http://x/api/gigs', {
      method: 'POST',
      body: JSON.stringify({ title: 'Voiceover', category: 'audio', price: 70 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('Voiceover')
  expect(body.category).toBe('audio')
  expect(body.reviews).toEqual([])
  expect(body.id).toBe('g4')
})

it('POST defaults category to dev and price to 0', async () => {
  const res = await POST(req('http://x/api/gigs', { method: 'POST', body: JSON.stringify({ title: 'Thing' }) }))
  const body = await res.json()
  expect(body.category).toBe('dev')
  expect(body.price).toBe(0)
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/gigs', { method: 'POST', body: JSON.stringify({ price: 5 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT adds a review to a gig', async () => {
  const res = await PUT(
    req('http://x/api/gigs?id=g2', {
      method: 'PUT',
      body: JSON.stringify({ author: 'kim', rating: 5, text: 'Loved it' }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.reviews).toHaveLength(1)
  expect(body.reviews[0].id).toBe('r4')
  expect(body.reviews[0].author).toBe('kim')
})

it('PUT without an author returns 400', async () => {
  const res = await PUT(req('http://x/api/gigs?id=g2', { method: 'PUT', body: JSON.stringify({ rating: 5 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'author required' })
})

it('PUT on a missing gig returns 404', async () => {
  const res = await PUT(
    req('http://x/api/gigs?id=nope', { method: 'PUT', body: JSON.stringify({ author: 'kim', rating: 5 }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
