import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/articles/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded articles', async () => {
  const res = await GET(req('http://x/api/articles'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.articles.map((a: { id: string }) => a.id)).toEqual(['a1', 'a2', 'a3', 'a4', 'a5'])
})

it('GET filters by category', async () => {
  const res = await GET(req('http://x/api/articles?category=billing'))
  const body = await res.json()
  expect(body.articles.map((a: { id: string }) => a.id)).toEqual(['a2', 'a5'])
})

it('GET filters by query over title and body', async () => {
  const res = await GET(req('http://x/api/articles?q=billing'))
  const body = await res.json()
  expect(body.articles.map((a: { id: string }) => a.id)).toEqual(['a2', 'a5'])
})

it('GET query is case-insensitive', async () => {
  const res = await GET(req('http://x/api/articles?q=PASSWORD'))
  const body = await res.json()
  expect(body.articles.map((a: { id: string }) => a.id)).toEqual(['a1'])
})

it('POST creates an article and returns 201', async () => {
  const res = await POST(
    req('http://x/api/articles', {
      method: 'POST',
      body: JSON.stringify({ title: 'How to export', body: 'Export from settings.', category: 'technical' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('How to export')
  expect(body.category).toBe('technical')
  expect(body.helpful).toBe(0)
  expect(body.notHelpful).toBe(0)
  expect(body.id).toBe('a6')
})

it('POST without a title returns 400', async () => {
  const res = await POST(
    req('http://x/api/articles', { method: 'POST', body: JSON.stringify({ body: 'no title' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT votes helpful', async () => {
  const res = await PUT(
    req('http://x/api/articles?id=a1', { method: 'PUT', body: JSON.stringify({ vote: 'helpful' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.helpful).toBe(6)
})

it('PUT votes not helpful', async () => {
  const res = await PUT(
    req('http://x/api/articles?id=a1', { method: 'PUT', body: JSON.stringify({ vote: 'notHelpful' }) }),
  )
  const body = await res.json()
  expect(body.notHelpful).toBe(2)
})

it('PUT updates the category', async () => {
  const res = await PUT(
    req('http://x/api/articles?id=a1', { method: 'PUT', body: JSON.stringify({ category: 'general' }) }),
  )
  const body = await res.json()
  expect(body.category).toBe('general')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/articles?id=nope', { method: 'PUT', body: JSON.stringify({ vote: 'helpful' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes an article', async () => {
  const del = await DELETE(req('http://x/api/articles?id=a1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/articles'))
  const body = await res.json()
  expect(body.articles.map((a: { id: string }) => a.id)).toEqual(['a2', 'a3', 'a4', 'a5'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/articles?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
