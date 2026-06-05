import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/clients/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded clients', async () => {
  const res = await GET(req('http://x/api/clients'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.clients.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2', 'c3'])
})

it('POST creates a client and returns 201', async () => {
  const res = await POST(
    req('http://x/api/clients', {
      method: 'POST',
      body: JSON.stringify({ name: 'Hooli', email: 'ar@hooli.test' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Hooli')
  expect(body.email).toBe('ar@hooli.test')
  expect(body.id).toBe('c4')
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/clients', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('a created client then appears in GET', async () => {
  await POST(req('http://x/api/clients', { method: 'POST', body: JSON.stringify({ name: 'Stark Industries' }) }))
  const res = await GET(req('http://x/api/clients'))
  const body = await res.json()
  expect(body.clients.map((c: { name: string }) => c.name)).toContain('Stark Industries')
})
