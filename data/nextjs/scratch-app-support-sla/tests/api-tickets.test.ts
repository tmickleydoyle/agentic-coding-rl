import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/tickets/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded tickets', async () => {
  const res = await GET(req('http://x/api/tickets'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.tickets.map((t: { id: string }) => t.id)).toEqual(['k1', 'k2', 'k3', 'k4', 'k5'])
})

it('GET filters to breached tickets', async () => {
  const res = await GET(req('http://x/api/tickets?breached=true'))
  const body = await res.json()
  expect(body.tickets.map((t: { id: string }) => t.id)).toEqual(['k1', 'k3', 'k5'])
})

it('POST creates a ticket and returns 201', async () => {
  const res = await POST(
    req('http://x/api/tickets', {
      method: 'POST',
      body: JSON.stringify({ subject: 'New incident', priority: 'high', slaMinutes: 30, elapsedMinutes: 5 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.subject).toBe('New incident')
  expect(body.priority).toBe('high')
  expect(body.slaMinutes).toBe(30)
  expect(body.responded).toBe(false)
  expect(body.escalated).toBe(false)
  expect(body.id).toBe('k6')
})

it('POST without a subject returns 400', async () => {
  const res = await POST(
    req('http://x/api/tickets', { method: 'POST', body: JSON.stringify({ priority: 'low' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'subject required' })
})

it('PUT respond marks the ticket responded and clears it from breaches', async () => {
  const res = await PUT(
    req('http://x/api/tickets?id=k1', { method: 'PUT', body: JSON.stringify({ action: 'respond' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.responded).toBe(true)
  const list = await (await GET(req('http://x/api/tickets?breached=true'))).json()
  expect(list.tickets.map((t: { id: string }) => t.id)).toEqual(['k3', 'k5'])
})

it('PUT escalate bumps the priority and marks escalated', async () => {
  const res = await PUT(
    req('http://x/api/tickets?id=k1', { method: 'PUT', body: JSON.stringify({ action: 'escalate' }) }),
  )
  const body = await res.json()
  expect(body.priority).toBe('urgent')
  expect(body.escalated).toBe(true)
})

it('PUT escalate keeps urgent at urgent', async () => {
  const res = await PUT(
    req('http://x/api/tickets?id=k3', { method: 'PUT', body: JSON.stringify({ action: 'escalate' }) }),
  )
  const body = await res.json()
  expect(body.priority).toBe('urgent')
  expect(body.escalated).toBe(true)
})

it('PUT with an unknown action returns 400', async () => {
  const res = await PUT(
    req('http://x/api/tickets?id=k1', { method: 'PUT', body: JSON.stringify({ action: 'wat' }) }),
  )
  expect(res.status).toBe(400)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/tickets?id=nope', { method: 'PUT', body: JSON.stringify({ action: 'respond' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a ticket', async () => {
  const del = await DELETE(req('http://x/api/tickets?id=k1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/tickets'))
  const body = await res.json()
  expect(body.tickets.map((t: { id: string }) => t.id)).toEqual(['k2', 'k3', 'k4', 'k5'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/tickets?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
