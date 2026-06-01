import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/deployments/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded deployments', async () => {
  const res = await GET(req('http://x/api/deployments'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.deployments.map((d: { id: string }) => d.id)).toEqual(['d1', 'd2', 'd3'])
})

it('GET filters by env', async () => {
  const res = await GET(req('http://x/api/deployments?env=stage'))
  const body = await res.json()
  expect(body.deployments.map((d: { id: string }) => d.id)).toEqual(['d2'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/deployments?status=success'))
  const body = await res.json()
  expect(body.deployments.map((d: { id: string }) => d.id)).toEqual(['d1', 'd3'])
})

it('POST creates a deployment and returns 201 queued', async () => {
  const res = await POST(
    req('http://x/api/deployments', {
      method: 'POST',
      body: JSON.stringify({ env: 'prod', service: 'worker' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('d4')
  expect(body.status).toBe('queued')
  expect(body.service).toBe('worker')
  expect(body.env).toBe('prod')
})

it('POST without a service returns 400', async () => {
  const res = await POST(
    req('http://x/api/deployments', { method: 'POST', body: JSON.stringify({ env: 'dev' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'service required' })
})

it('PUT rolls back when no explicit status is given', async () => {
  const res = await PUT(req('http://x/api/deployments?id=d1', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('rolled_back')
})

it('PUT sets status explicitly', async () => {
  const res = await PUT(
    req('http://x/api/deployments?id=d2', { method: 'PUT', body: JSON.stringify({ status: 'building' }) }),
  )
  const body = await res.json()
  expect(body.status).toBe('building')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/deployments?id=nope', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a deployment', async () => {
  const del = await DELETE(req('http://x/api/deployments?id=d2', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/deployments'))
  const body = await res.json()
  expect(body.deployments.map((d: { id: string }) => d.id)).toEqual(['d1', 'd3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/deployments?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
})
