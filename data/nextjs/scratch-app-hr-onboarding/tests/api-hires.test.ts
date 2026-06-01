import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/hires/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded hires with progress', async () => {
  const res = await GET(req('http://x/api/hires'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.hires.map((h: { id: string }) => h.id)).toEqual(['h1', 'h2', 'h3'])
  const h1 = body.hires.find((h: { id: string }) => h.id === 'h1')
  expect(h1.total).toBe(4)
  expect(h1.done).toBe(2)
  expect(h1.percent).toBe(50)
})

it('GET reports zero percent for a hire with no tasks', async () => {
  const res = await GET(req('http://x/api/hires'))
  const body = await res.json()
  const h3 = body.hires.find((h: { id: string }) => h.id === 'h3')
  expect(h3.total).toBe(0)
  expect(h3.percent).toBe(0)
})

it('GET ?tasks lists all tasks', async () => {
  const res = await GET(req('http://x/api/hires?tasks=1'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t1', 't2', 't3', 't4', 't5', 't6'])
})

it('GET ?tasks&hireId filters tasks for a hire', async () => {
  const res = await GET(req('http://x/api/hires?tasks=1&hireId=h2'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t5', 't6'])
})

it('POST creates a hire and returns 201', async () => {
  const res = await POST(
    req('http://x/api/hires', { method: 'POST', body: JSON.stringify({ name: 'Katherine', role: 'Analyst', startDate: '2026-08-01' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Katherine')
  expect(body.role).toBe('Analyst')
  expect(body.id).toBe('h4')
})

it('POST defaults a missing role', async () => {
  const res = await POST(req('http://x/api/hires', { method: 'POST', body: JSON.stringify({ name: 'Sam' }) }))
  const body = await res.json()
  expect(body.role).toBe('New Hire')
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/hires', { method: 'POST', body: JSON.stringify({ role: 'X' }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST with hireId and label creates an onboarding task', async () => {
  const res = await POST(
    req('http://x/api/hires', { method: 'POST', body: JSON.stringify({ hireId: 'h3', label: 'Order badge' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.label).toBe('Order badge')
  expect(body.hireId).toBe('h3')
  expect(body.done).toBe(false)
  expect(body.id).toBe('t7')
})

it('POST a task for a missing hire returns 404', async () => {
  const res = await POST(
    req('http://x/api/hires', { method: 'POST', body: JSON.stringify({ hireId: 'nope', label: 'X' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'hire not found' })
})

it('PUT toggles a task done state', async () => {
  const res = await PUT(req('http://x/api/hires?id=t3', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.done).toBe(true)
})

it('PUT can set a task done explicitly', async () => {
  const res = await PUT(req('http://x/api/hires?id=t1', { method: 'PUT', body: JSON.stringify({ done: false }) }))
  const body = await res.json()
  expect(body.done).toBe(false)
})

it('PUT on a missing task returns 404', async () => {
  const res = await PUT(req('http://x/api/hires?id=nope', { method: 'PUT', body: JSON.stringify({ done: true }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('a created hire then appears in GET', async () => {
  await POST(req('http://x/api/hires', { method: 'POST', body: JSON.stringify({ name: 'Rosa' }) }))
  const res = await GET(req('http://x/api/hires'))
  const body = await res.json()
  expect(body.hires.map((h: { name: string }) => h.name)).toContain('Rosa')
})
