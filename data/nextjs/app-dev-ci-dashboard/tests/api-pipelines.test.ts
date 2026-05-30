import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/pipelines/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded pipelines', async () => {
  const res = await GET(req('http://x/api/pipelines'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.pipelines.map((p: { id: string }) => p.id)).toEqual(['pl1', 'pl2', 'pl3'])
})

it('POST creates a pipeline and returns 201', async () => {
  const res = await POST(
    req('http://x/api/pipelines', { method: 'POST', body: JSON.stringify({ name: 'Mobile', repo: 'acme/mobile' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Mobile')
  expect(body.repo).toBe('acme/mobile')
  expect(body.id).toBe('pl4')
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/pipelines', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('a created pipeline then appears in GET', async () => {
  await POST(req('http://x/api/pipelines', { method: 'POST', body: JSON.stringify({ name: 'Infra' }) }))
  const res = await GET(req('http://x/api/pipelines'))
  const body = await res.json()
  expect(body.pipelines.map((p: { name: string }) => p.name)).toContain('Infra')
})
