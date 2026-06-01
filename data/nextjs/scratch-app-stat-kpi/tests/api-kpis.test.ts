import { it, expect, beforeEach } from 'vitest'
import { GET, PUT, __reset } from '../app/api/kpis/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded kpis', async () => {
  const res = await GET(req('http://x/api/kpis'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.kpis.map((k: { id: string }) => k.id)).toEqual(['k1', 'k2', 'k3', 'k4'])
})

it('GET by id returns a single kpi', async () => {
  const res = await GET(req('http://x/api/kpis?id=k2'))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('k2')
  expect(body.name).toBe('Churn')
})

it('GET by unknown id returns 404', async () => {
  const res = await GET(req('http://x/api/kpis?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('PUT updates a target', async () => {
  const res = await PUT(req('http://x/api/kpis?id=k1', { method: 'PUT', body: JSON.stringify({ target: 200 }) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.target).toBe(200)
})

it('a PUT target persists for the next GET', async () => {
  await PUT(req('http://x/api/kpis?id=k1', { method: 'PUT', body: JSON.stringify({ target: 150 }) }))
  const res = await GET(req('http://x/api/kpis?id=k1'))
  const body = await res.json()
  expect(body.target).toBe(150)
})

it('PUT without a numeric target returns 400', async () => {
  const res = await PUT(req('http://x/api/kpis?id=k1', { method: 'PUT', body: JSON.stringify({ target: 'high' }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'target required' })
})

it('PUT on an unknown id returns 404', async () => {
  const res = await PUT(req('http://x/api/kpis?id=nope', { method: 'PUT', body: JSON.stringify({ target: 10 }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
