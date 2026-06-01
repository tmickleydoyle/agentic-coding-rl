import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/leads/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded leads', async () => {
  const res = await GET(req('http://x/api/leads'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.leads.map((l: { id: string }) => l.id)).toEqual(['l1', 'l2', 'l3', 'l4'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/leads?status=new'))
  const body = await res.json()
  expect(body.leads.map((l: { id: string }) => l.id)).toEqual(['l1', 'l3'])
})

it('GET filters by minScore', async () => {
  const res = await GET(req('http://x/api/leads?minScore=80'))
  const body = await res.json()
  expect(body.leads.map((l: { id: string }) => l.id)).toEqual(['l1', 'l4'])
})

it('GET counts returns per-status counts', async () => {
  const res = await GET(req('http://x/api/leads?counts=true'))
  const body = await res.json()
  expect(body.counts).toEqual({ new: 2, qualified: 1, converted: 1, lost: 0 })
})

it('POST creates a lead with defaults and status new', async () => {
  const res = await POST(
    req('http://x/api/leads', { method: 'POST', body: JSON.stringify({ name: 'New Lead' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('New Lead')
  expect(body.source).toBe('web')
  expect(body.score).toBe(0)
  expect(body.status).toBe('new')
  expect(body.id).toBe('l5')
})

it('POST accepts source and score', async () => {
  const res = await POST(
    req('http://x/api/leads', {
      method: 'POST',
      body: JSON.stringify({ name: 'X', source: 'event', score: 45 }),
    }),
  )
  const body = await res.json()
  expect(body.source).toBe('event')
  expect(body.score).toBe(45)
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/leads', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('PUT updates status', async () => {
  const res = await PUT(
    req('http://x/api/leads?id=l1', { method: 'PUT', body: JSON.stringify({ status: 'qualified' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('qualified')
})

it('PUT updates score', async () => {
  const res = await PUT(
    req('http://x/api/leads?id=l1', { method: 'PUT', body: JSON.stringify({ score: 95 }) }),
  )
  const body = await res.json()
  expect(body.score).toBe(95)
})

it('PUT ignores an invalid status', async () => {
  const res = await PUT(
    req('http://x/api/leads?id=l1', { method: 'PUT', body: JSON.stringify({ status: 'bogus' }) }),
  )
  const body = await res.json()
  expect(body.status).toBe('new')
})

it('PUT action=convert sets converted and creates a deal', async () => {
  const res = await PUT(
    req('http://x/api/leads?id=l1&action=convert', { method: 'PUT', body: JSON.stringify({ value: 7000 }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.lead.status).toBe('converted')
  expect(body.deal.value).toBe(7000)
  expect(body.deal.leadId).toBe('l1')
  expect(body.deal.id).toBe('d2')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/leads?id=nope', { method: 'PUT', body: JSON.stringify({ status: 'lost' }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a lead', async () => {
  const del = await DELETE(req('http://x/api/leads?id=l1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/leads'))
  const body = await res.json()
  expect(body.leads.map((l: { id: string }) => l.id)).toEqual(['l2', 'l3', 'l4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/leads?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
