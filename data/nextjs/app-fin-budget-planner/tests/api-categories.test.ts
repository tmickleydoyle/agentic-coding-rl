import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/categories/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded categories', async () => {
  const res = await GET(req('http://x/api/categories'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.categories.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2', 'c3'])
})

it('POST creates a category and returns 201', async () => {
  const res = await POST(
    req('http://x/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name: 'Fun', planned: 80 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Fun')
  expect(body.planned).toBe(80)
  expect(body.id).toBe('c4')
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/categories', { method: 'POST', body: JSON.stringify({ planned: 10 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST defaults planned to 0 when missing', async () => {
  const res = await POST(
    req('http://x/api/categories', { method: 'POST', body: JSON.stringify({ name: 'Misc' }) }),
  )
  const body = await res.json()
  expect(body.planned).toBe(0)
})

it('a created category then appears in GET', async () => {
  await POST(
    req('http://x/api/categories', { method: 'POST', body: JSON.stringify({ name: 'Travel' }) }),
  )
  const res = await GET(req('http://x/api/categories'))
  const body = await res.json()
  expect(body.categories.map((c: { name: string }) => c.name)).toContain('Travel')
})
