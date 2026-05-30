import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/leads/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded leads', async () => {
  const res = await GET(req('http://x/api/leads'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.leads.map((l: { id: string }) => l.id)).toEqual(['l1', 'l2', 'l3'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/leads?status=offer'))
  const body = await res.json()
  expect(body.leads.map((l: { id: string }) => l.id)).toEqual(['l3'])
})

it('GET by id returns a single lead', async () => {
  const res = await GET(req('http://x/api/leads?id=l2'))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.name).toBe('Ben Cole')
  expect(body.propertyId).toBe('p1')
})

it('GET by unknown id returns 404', async () => {
  const res = await GET(req('http://x/api/leads?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST creates a lead defaulting to new and returns 201', async () => {
  const res = await POST(
    req('http://x/api/leads', { method: 'POST', body: JSON.stringify({ name: 'Dee Park' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Dee Park')
  expect(body.status).toBe('new')
  expect(body.propertyId).toBe(null)
  expect(body.id).toBe('l4')
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/leads', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('PUT updates a lead status', async () => {
  const res = await PUT(
    req('http://x/api/leads?id=l1', { method: 'PUT', body: JSON.stringify({ status: 'touring' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('touring')
})

it('PUT with an invalid status returns 400', async () => {
  const res = await PUT(
    req('http://x/api/leads?id=l1', { method: 'PUT', body: JSON.stringify({ status: 'bogus' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid status' })
})

it('PUT assigns a property to a lead', async () => {
  const res = await PUT(
    req('http://x/api/leads?id=l1', { method: 'PUT', body: JSON.stringify({ propertyId: 'p1' }) }),
  )
  const body = await res.json()
  expect(body.propertyId).toBe('p1')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/leads?id=nope', { method: 'PUT', body: JSON.stringify({ status: 'closed' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a lead', async () => {
  const del = await DELETE(req('http://x/api/leads?id=l1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/leads'))
  const body = await res.json()
  expect(body.leads.map((l: { id: string }) => l.id)).toEqual(['l2', 'l3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/leads?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
