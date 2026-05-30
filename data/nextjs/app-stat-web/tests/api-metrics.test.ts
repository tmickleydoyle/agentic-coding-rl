import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/metrics/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded pages with all-time views', async () => {
  const res = await GET(req('http://x/api/metrics'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.pages.map((p: { id: string }) => p.id)).toEqual(['pg1', 'pg2', 'pg3', 'pg4'])
  expect(body.pages[0].views).toBe(1000)
})

it('GET with range=7d swaps views for the 7d counts', async () => {
  const res = await GET(req('http://x/api/metrics?range=7d'))
  const body = await res.json()
  expect(body.pages.map((p: { views: number }) => p.views)).toEqual([200, 150, 50, 120])
})

it('GET with range=30d swaps views for the 30d counts', async () => {
  const res = await GET(req('http://x/api/metrics?range=30d'))
  const body = await res.json()
  expect(body.pages.map((p: { views: number }) => p.views)).toEqual([600, 400, 120, 300])
})

it('GET filters by minViews on the all-time views', async () => {
  const res = await GET(req('http://x/api/metrics?minViews=500'))
  const body = await res.json()
  expect(body.pages.map((p: { id: string }) => p.id)).toEqual(['pg1', 'pg2'])
})

it('GET combines range and minViews against the range-adjusted views', async () => {
  const res = await GET(req('http://x/api/metrics?range=30d&minViews=400'))
  const body = await res.json()
  // 30d: pg1=600, pg2=400, pg3=120, pg4=300 ; >=400 => pg1, pg2
  expect(body.pages.map((p: { id: string }) => p.id)).toEqual(['pg1', 'pg2'])
})

it('POST creates a page and returns 201', async () => {
  const res = await POST(
    req('http://x/api/metrics', {
      method: 'POST',
      body: JSON.stringify({ path: '/contact', views: 50, sessions: 40, bounceRate: 60 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('pg5')
  expect(body.path).toBe('/contact')
  expect(body.views).toBe(50)
  expect(body.range7d).toBe(0)
})

it('POST defaults numeric fields to 0', async () => {
  const res = await POST(
    req('http://x/api/metrics', { method: 'POST', body: JSON.stringify({ path: '/x' }) }),
  )
  const body = await res.json()
  expect(body.views).toBe(0)
  expect(body.sessions).toBe(0)
  expect(body.bounceRate).toBe(0)
})

it('POST without a path returns 400', async () => {
  const res = await POST(req('http://x/api/metrics', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'path required' })
})

it('PUT updates provided numeric fields', async () => {
  const res = await PUT(
    req('http://x/api/metrics?id=pg1', { method: 'PUT', body: JSON.stringify({ views: 1234 }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.views).toBe(1234)
  expect(body.sessions).toBe(800)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/metrics?id=nope', { method: 'PUT', body: JSON.stringify({ views: 1 }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a page', async () => {
  const del = await DELETE(req('http://x/api/metrics?id=pg1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/metrics'))
  const body = await res.json()
  expect(body.pages.map((p: { id: string }) => p.id)).toEqual(['pg2', 'pg3', 'pg4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/metrics?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
