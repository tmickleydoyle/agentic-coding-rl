import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/posts/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded posts', async () => {
  const res = await GET(req('http://x/api/posts'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.posts.map((p: { id: string }) => p.id)).toEqual(['p1', 'p2', 'p3'])
})

it('GET filters by authorId', async () => {
  const res = await GET(req('http://x/api/posts?authorId=u2'))
  const body = await res.json()
  expect(body.posts.map((p: { id: string }) => p.id)).toEqual(['p1'])
})

it('POST creates a post and returns 201', async () => {
  const res = await POST(
    req('http://x/api/posts', { method: 'POST', body: JSON.stringify({ authorId: 'u1', text: 'New post' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.text).toBe('New post')
  expect(body.authorId).toBe('u1')
  expect(body.likes).toBe(0)
  expect(body.likedByMe).toBe(false)
  expect(body.id).toBe('p4')
})

it('POST without text returns 400', async () => {
  const res = await POST(
    req('http://x/api/posts', { method: 'POST', body: JSON.stringify({ authorId: 'u1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'text required' })
})

it('POST without authorId returns 400', async () => {
  const res = await POST(
    req('http://x/api/posts', { method: 'POST', body: JSON.stringify({ text: 'Orphan' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'authorId required' })
})

it('PUT toggles like when no explicit value given', async () => {
  const res = await PUT(req('http://x/api/posts?id=p1', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.likedByMe).toBe(true)
  expect(body.likes).toBe(4)
})

it('PUT setting liked false on an unliked post does not change likes', async () => {
  const res = await PUT(
    req('http://x/api/posts?id=p1', { method: 'PUT', body: JSON.stringify({ liked: false }) }),
  )
  const body = await res.json()
  expect(body.likedByMe).toBe(false)
  expect(body.likes).toBe(3)
})

it('PUT setting liked false on an already-liked post decrements likes', async () => {
  const res = await PUT(
    req('http://x/api/posts?id=p2', { method: 'PUT', body: JSON.stringify({ liked: false }) }),
  )
  const body = await res.json()
  expect(body.likedByMe).toBe(false)
  expect(body.likes).toBe(0)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/posts?id=nope', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a post', async () => {
  const del = await DELETE(req('http://x/api/posts?id=p1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/posts'))
  const body = await res.json()
  expect(body.posts.map((p: { id: string }) => p.id)).toEqual(['p2', 'p3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/posts?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
