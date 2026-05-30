import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/snippets/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded snippets', async () => {
  const res = await GET(req('http://x/api/snippets'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.snippets.map((s: { id: string }) => s.id)).toEqual(['s1', 's2', 's3'])
})

it('GET filters by language', async () => {
  const res = await GET(req('http://x/api/snippets?language=python'))
  const body = await res.json()
  expect(body.snippets.map((s: { id: string }) => s.id)).toEqual(['s2'])
})

it('GET filters by favorite=true', async () => {
  const res = await GET(req('http://x/api/snippets?favorite=true'))
  const body = await res.json()
  expect(body.snippets.map((s: { id: string }) => s.id)).toEqual(['s2'])
})

it('GET filters by q (case-insensitive title)', async () => {
  const res = await GET(req('http://x/api/snippets?q=FLEX'))
  const body = await res.json()
  expect(body.snippets.map((s: { id: string }) => s.id)).toEqual(['s3'])
})

it('POST creates a snippet and returns 201', async () => {
  const res = await POST(
    req('http://x/api/snippets', {
      method: 'POST',
      body: JSON.stringify({ title: 'Throttle', language: 'js', code: 'x' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('Throttle')
  expect(body.favorite).toBe(false)
  expect(body.copyCount).toBe(0)
  expect(body.id).toBe('s4')
})

it('POST without a language returns 400', async () => {
  const res = await POST(
    req('http://x/api/snippets', { method: 'POST', body: JSON.stringify({ title: 'x' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title and language required' })
})

it('PUT toggles favorite explicitly', async () => {
  const res = await PUT(
    req('http://x/api/snippets?id=s1', { method: 'PUT', body: JSON.stringify({ favorite: true }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.favorite).toBe(true)
})

it('PUT with copy=true increments the copy count', async () => {
  const res = await PUT(
    req('http://x/api/snippets?id=s2', { method: 'PUT', body: JSON.stringify({ copy: true }) }),
  )
  const body = await res.json()
  expect(body.copyCount).toBe(3)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/snippets?id=nope', { method: 'PUT', body: JSON.stringify({ favorite: true }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a snippet', async () => {
  const del = await DELETE(req('http://x/api/snippets?id=s1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/snippets'))
  const body = await res.json()
  expect(body.snippets.map((s: { id: string }) => s.id)).toEqual(['s2', 's3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/snippets?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
