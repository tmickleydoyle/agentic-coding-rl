import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/series/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists series and all parts', async () => {
  const res = await GET(req('http://x/api/series'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.series.map((s: { id: string }) => s.id)).toEqual(['s1', 's2'])
  expect(body.parts.map((p: { id: string }) => p.id)).toEqual([
    'x1', 'x2', 'x3', 'x4', 'x5', 'x6',
  ])
})

it('GET filters parts by seriesId and sorts by order', async () => {
  const res = await GET(req('http://x/api/series?seriesId=s1'))
  const body = await res.json()
  expect(body.parts.map((p: { id: string }) => p.id)).toEqual(['x1', 'x2', 'x3'])
  expect(body.series.length).toBe(2)
})

it('POST creates a part with the next order and returns 201', async () => {
  const res = await POST(
    req('http://x/api/series', {
      method: 'POST',
      body: JSON.stringify({ seriesId: 's1', title: 'Traits' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('x7')
  expect(body.order).toBe(4)
  expect(body.read).toBe(false)
  expect(body.seriesId).toBe('s1')
})

it('POST without a title returns 400', async () => {
  const res = await POST(
    req('http://x/api/series', { method: 'POST', body: JSON.stringify({ seriesId: 's1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('POST with an unknown series returns 404', async () => {
  const res = await POST(
    req('http://x/api/series', {
      method: 'POST',
      body: JSON.stringify({ seriesId: 'nope', title: 'X' }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'series not found' })
})

it('PUT toggles read when no explicit value is given', async () => {
  const res = await PUT(req('http://x/api/series?id=x3', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('x3')
  expect(body.read).toBe(true)
})

it('PUT sets read explicitly', async () => {
  const res = await PUT(
    req('http://x/api/series?id=x1', { method: 'PUT', body: JSON.stringify({ read: false }) }),
  )
  const body = await res.json()
  expect(body.read).toBe(false)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/series?id=nope', { method: 'PUT', body: JSON.stringify({ read: true }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('a created part appears in a subsequent GET for that series', async () => {
  await POST(
    req('http://x/api/series', {
      method: 'POST',
      body: JSON.stringify({ seriesId: 's2', title: 'Streams' }),
    }),
  )
  const res = await GET(req('http://x/api/series?seriesId=s2'))
  const body = await res.json()
  expect(body.parts.map((p: { title: string }) => p.title)).toContain('Streams')
  expect(body.parts.length).toBe(4)
})
