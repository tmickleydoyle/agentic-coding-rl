import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/builds/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded builds', async () => {
  const res = await GET(req('http://x/api/builds'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.builds.map((b: { id: string }) => b.id)).toEqual(['b1', 'b2', 'b3', 'b4', 'b5'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/builds?status=failing'))
  const body = await res.json()
  expect(body.builds.map((b: { id: string }) => b.id)).toEqual(['b2'])
})

it('GET filters by pipelineId', async () => {
  const res = await GET(req('http://x/api/builds?pipelineId=pl1'))
  const body = await res.json()
  expect(body.builds.map((b: { id: string }) => b.id)).toEqual(['b1', 'b2'])
})

it('GET combines status and pipelineId filters', async () => {
  const res = await GET(req('http://x/api/builds?pipelineId=pl1&status=passing'))
  const body = await res.json()
  expect(body.builds.map((b: { id: string }) => b.id)).toEqual(['b1'])
})

it('POST creates a running build and returns 201', async () => {
  const res = await POST(
    req('http://x/api/builds', { method: 'POST', body: JSON.stringify({ pipelineId: 'pl1' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('b6')
  expect(body.pipelineId).toBe('pl1')
  expect(body.status).toBe('running')
  expect(body.number).toBe(103) // max(101,102) + 1
})

it('POST without a pipelineId returns 400', async () => {
  const res = await POST(req('http://x/api/builds', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'pipelineId required' })
})

it('PUT retries (running) when no explicit status', async () => {
  const res = await PUT(req('http://x/api/builds?id=b2', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('running')
})

it('PUT sets status explicitly', async () => {
  const res = await PUT(
    req('http://x/api/builds?id=b4', { method: 'PUT', body: JSON.stringify({ status: 'passing' }) }),
  )
  const body = await res.json()
  expect(body.status).toBe('passing')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/builds?id=nope', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a build', async () => {
  const del = await DELETE(req('http://x/api/builds?id=b1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/builds'))
  const body = await res.json()
  expect(body.builds.map((b: { id: string }) => b.id)).toEqual(['b2', 'b3', 'b4', 'b5'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/builds?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
