import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/suppliers/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded suppliers', async () => {
  const res = await GET(req('http://x/api/suppliers'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.suppliers.map((s: { id: string }) => s.id)).toEqual(['s1', 's2', 's3'])
})

it('GET filters by category', async () => {
  const res = await GET(req('http://x/api/suppliers?category=Food'))
  const body = await res.json()
  expect(body.suppliers.map((s: { id: string }) => s.id)).toEqual(['s2'])
})

it('POST creates a supplier and returns 201', async () => {
  const res = await POST(
    req('http://x/api/suppliers', {
      method: 'POST',
      body: JSON.stringify({ name: 'FastShip', category: 'Logistics', leadTimeDays: 2, rating: 4.0 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('FastShip')
  expect(body.leadTimeDays).toBe(2)
  expect(body.id).toBe('s4')
})

it('POST defaults missing category to Uncategorized', async () => {
  const res = await POST(
    req('http://x/api/suppliers', { method: 'POST', body: JSON.stringify({ name: 'Lone', leadTimeDays: 1 }) }),
  )
  const body = await res.json()
  expect(body.category).toBe('Uncategorized')
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/suppliers', { method: 'POST', body: JSON.stringify({ leadTimeDays: 3 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST without leadTimeDays returns 400', async () => {
  const res = await POST(
    req('http://x/api/suppliers', { method: 'POST', body: JSON.stringify({ name: 'NoLead' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'leadTimeDays required' })
})

it('POST with negative leadTimeDays returns 400', async () => {
  const res = await POST(
    req('http://x/api/suppliers', { method: 'POST', body: JSON.stringify({ name: 'Bad', leadTimeDays: -1 }) }),
  )
  expect(res.status).toBe(400)
})

it('a created supplier then appears in GET', async () => {
  await POST(
    req('http://x/api/suppliers', { method: 'POST', body: JSON.stringify({ name: 'NewVendor', leadTimeDays: 6 }) }),
  )
  const res = await GET(req('http://x/api/suppliers'))
  const body = await res.json()
  expect(body.suppliers.map((s: { name: string }) => s.name)).toContain('NewVendor')
})
