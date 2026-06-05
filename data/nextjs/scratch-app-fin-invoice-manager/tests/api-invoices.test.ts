import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/invoices/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded invoices', async () => {
  const res = await GET(req('http://x/api/invoices'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.invoices.map((i: { id: string }) => i.id)).toEqual(['i1', 'i2', 'i3'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/invoices?status=paid'))
  const body = await res.json()
  expect(body.invoices.map((i: { id: string }) => i.id)).toEqual(['i2'])
})

it('GET filters by clientId', async () => {
  const res = await GET(req('http://x/api/invoices?clientId=c3'))
  const body = await res.json()
  expect(body.invoices.map((i: { id: string }) => i.id)).toEqual(['i3'])
})

it('POST creates an invoice and returns 201', async () => {
  const res = await POST(
    req('http://x/api/invoices', {
      method: 'POST',
      body: JSON.stringify({ clientId: 'c2', amount: 500, dueDate: '2026-07-01' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.amount).toBe(500)
  expect(body.clientId).toBe('c2')
  expect(body.status).toBe('draft')
  expect(body.id).toBe('i4')
})

it('POST with a non-positive amount returns 400', async () => {
  const res = await POST(
    req('http://x/api/invoices', { method: 'POST', body: JSON.stringify({ clientId: 'c1', amount: 0 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'amount required' })
})

it('POST without an amount returns 400', async () => {
  const res = await POST(
    req('http://x/api/invoices', { method: 'POST', body: JSON.stringify({ clientId: 'c1' }) }),
  )
  expect(res.status).toBe(400)
})

it('PUT marks paid when no explicit status is given', async () => {
  const res = await PUT(req('http://x/api/invoices?id=i1', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('i1')
  expect(body.status).toBe('paid')
})

it('PUT sets status explicitly', async () => {
  const res = await PUT(
    req('http://x/api/invoices?id=i1', { method: 'PUT', body: JSON.stringify({ status: 'overdue' }) }),
  )
  const body = await res.json()
  expect(body.status).toBe('overdue')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/invoices?id=nope', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes an invoice', async () => {
  const del = await DELETE(req('http://x/api/invoices?id=i1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/invoices'))
  const body = await res.json()
  expect(body.invoices.map((i: { id: string }) => i.id)).toEqual(['i2', 'i3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/invoices?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
