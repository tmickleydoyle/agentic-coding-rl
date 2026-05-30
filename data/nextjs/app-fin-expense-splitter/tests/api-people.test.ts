import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/people/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded people', async () => {
  const res = await GET(req('http://x/api/people'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.people.map((p: { id: string }) => p.id)).toEqual(['u1', 'u2', 'u3'])
})

it('POST creates a person and returns 201', async () => {
  const res = await POST(
    req('http://x/api/people', { method: 'POST', body: JSON.stringify({ name: 'Dave' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Dave')
  expect(body.id).toBe('u4')
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/people', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('a created person then appears in GET', async () => {
  await POST(req('http://x/api/people', { method: 'POST', body: JSON.stringify({ name: 'Erin' }) }))
  const res = await GET(req('http://x/api/people'))
  const body = await res.json()
  expect(body.people.map((p: { name: string }) => p.name)).toContain('Erin')
})
