import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/projects/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded projects with task counts', async () => {
  const res = await GET(req('http://x/api/projects'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.projects.map((p: { id: string }) => p.id)).toEqual(['p1', 'p2', 'p3'])
  const p1 = body.projects.find((p: { id: string }) => p.id === 'p1')
  expect(p1.taskCount).toBe(2)
})

it('GET reports zero count for empty projects', async () => {
  const res = await GET(req('http://x/api/projects'))
  const body = await res.json()
  const p2 = body.projects.find((p: { id: string }) => p.id === 'p2')
  expect(p2.taskCount).toBe(0)
})

it('POST creates a project and returns 201', async () => {
  const res = await POST(
    req('http://x/api/projects', { method: 'POST', body: JSON.stringify({ name: 'Infra' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Infra')
  expect(body.id).toBe('p4')
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/projects', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('a created project then appears in GET', async () => {
  await POST(req('http://x/api/projects', { method: 'POST', body: JSON.stringify({ name: 'Data' }) }))
  const res = await GET(req('http://x/api/projects'))
  const body = await res.json()
  expect(body.projects.map((p: { name: string }) => p.name)).toContain('Data')
})
