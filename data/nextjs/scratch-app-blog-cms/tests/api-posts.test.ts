import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/posts/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded posts', async () => {
  const res = await GET(req('http://x/api/posts'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.posts.map((p: { id: string }) => p.id)).toEqual(['b1', 'b2', 'b3'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/posts?status=draft'))
  const body = await res.json()
  expect(body.posts.map((p: { id: string }) => p.id)).toEqual(['b2'])
})

it('GET filters by categoryId', async () => {
  const res = await GET(req('http://x/api/posts?categoryId=c1'))
  const body = await res.json()
  expect(body.posts.map((p: { id: string }) => p.id)).toEqual(['b1'])
})

it('POST creates a draft post by default and returns 201', async () => {
  const res = await POST(
    req('http://x/api/posts', { method: 'POST', body: JSON.stringify({ title: 'New one', categoryId: 'c2' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('New one')
  expect(body.categoryId).toBe('c2')
  expect(body.status).toBe('draft')
  expect(body.id).toBe('b4')
})

it('POST honors an explicit published status', async () => {
  const res = await POST(
    req('http://x/api/posts', { method: 'POST', body: JSON.stringify({ title: 'Live', status: 'published' }) }),
  )
  const body = await res.json()
  expect(body.status).toBe('published')
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/posts', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT toggles status when none is given', async () => {
  const res = await PUT(req('http://x/api/posts?id=b2', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('published') // b2 was draft
})

it('PUT updates the title explicitly', async () => {
  const res = await PUT(
    req('http://x/api/posts?id=b1', { method: 'PUT', body: JSON.stringify({ title: 'Renamed', status: 'draft' }) }),
  )
  const body = await res.json()
  expect(body.title).toBe('Renamed')
  expect(body.status).toBe('draft')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/posts?id=nope', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a post', async () => {
  const del = await DELETE(req('http://x/api/posts?id=b1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/posts'))
  const body = await res.json()
  expect(body.posts.map((p: { id: string }) => p.id)).toEqual(['b2', 'b3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/posts?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
