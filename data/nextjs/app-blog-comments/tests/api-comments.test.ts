import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/comments/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded comments', async () => {
  const res = await GET(req('http://x/api/comments'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.comments.map((c: { id: string }) => c.id)).toEqual(['k1', 'k2', 'k3', 'k4'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/comments?status=pending'))
  const body = await res.json()
  expect(body.comments.map((c: { id: string }) => c.id)).toEqual(['k2', 'k3'])
})

it('GET filters by postId', async () => {
  const res = await GET(req('http://x/api/comments?postId=p1'))
  const body = await res.json()
  expect(body.comments.map((c: { id: string }) => c.id)).toEqual(['k1', 'k2'])
})

it('POST creates a pending comment and returns 201', async () => {
  const res = await POST(
    req('http://x/api/comments', {
      method: 'POST',
      body: JSON.stringify({ postId: 'p1', author: 'Nat', body: 'nice' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.author).toBe('Nat')
  expect(body.postId).toBe('p1')
  expect(body.status).toBe('pending')
  expect(body.id).toBe('k5')
})

it('POST without a postId returns 400', async () => {
  const res = await POST(
    req('http://x/api/comments', { method: 'POST', body: JSON.stringify({ author: 'Nat' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'postId required' })
})

it('POST without an author returns 400', async () => {
  const res = await POST(
    req('http://x/api/comments', { method: 'POST', body: JSON.stringify({ postId: 'p1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'author required' })
})

it('PUT updates a comment status', async () => {
  const res = await PUT(
    req('http://x/api/comments?id=k2', { method: 'PUT', body: JSON.stringify({ status: 'approved' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('k2')
  expect(body.status).toBe('approved')
})

it('PUT with an invalid status returns 400', async () => {
  const res = await PUT(
    req('http://x/api/comments?id=k2', { method: 'PUT', body: JSON.stringify({ status: 'nope' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid status' })
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/comments?id=zzz', { method: 'PUT', body: JSON.stringify({ status: 'spam' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a comment', async () => {
  const del = await DELETE(req('http://x/api/comments?id=k1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/comments'))
  const body = await res.json()
  expect(body.comments.map((c: { id: string }) => c.id)).toEqual(['k2', 'k3', 'k4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/comments?id=zzz', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
