import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/projects/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded projects', async () => {
  const res = await GET(req('http://x/api/projects'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.projects.map((p: { id: string }) => p.id)).toEqual(['p1', 'p2', 'p3'])
})

it('POST creates a project and returns 201', async () => {
  const res = await POST(
    req('http://x/api/projects', { method: 'POST', body: JSON.stringify({ name: 'Side hustle' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Side hustle')
  expect(body.id).toBe('p4')
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/projects', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('a created project then appears in GET', async () => {
  await POST(req('http://x/api/projects', { method: 'POST', body: JSON.stringify({ name: 'Garage' }) }))
  const res = await GET(req('http://x/api/projects'))
  const body = await res.json()
  expect(body.projects.map((p: { name: string }) => p.name)).toContain('Garage')
})
