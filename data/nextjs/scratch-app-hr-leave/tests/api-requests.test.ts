import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/requests/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded requests', async () => {
  const res = await GET(req('http://x/api/requests'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.requests.map((r: { id: string }) => r.id)).toEqual(['r1', 'r2', 'r3', 'r4'])
})

it('GET filters by employeeId', async () => {
  const res = await GET(req('http://x/api/requests?employeeId=e1'))
  const body = await res.json()
  expect(body.requests.map((r: { id: string }) => r.id)).toEqual(['r1', 'r2'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/requests?status=pending'))
  const body = await res.json()
  expect(body.requests.map((r: { id: string }) => r.id)).toEqual(['r2', 'r3'])
})

it('GET combines employeeId and status with AND', async () => {
  const res = await GET(req('http://x/api/requests?employeeId=e1&status=approved'))
  const body = await res.json()
  expect(body.requests.map((r: { id: string }) => r.id)).toEqual(['r1'])
})

it('POST creates a pending request and returns 201', async () => {
  const res = await POST(
    req('http://x/api/requests', { method: 'POST', body: JSON.stringify({ employeeId: 'e3', day: '2026-07-01', days: 4, reason: 'Holiday' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.employeeId).toBe('e3')
  expect(body.day).toBe('2026-07-01')
  expect(body.days).toBe(4)
  expect(body.status).toBe('pending')
  expect(body.id).toBe('r5')
})

it('POST defaults days to 1', async () => {
  const res = await POST(
    req('http://x/api/requests', { method: 'POST', body: JSON.stringify({ employeeId: 'e1', day: '2026-07-02' }) }),
  )
  const body = await res.json()
  expect(body.days).toBe(1)
})

it('POST without an employeeId returns 400', async () => {
  const res = await POST(req('http://x/api/requests', { method: 'POST', body: JSON.stringify({ day: '2026-07-01' }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'employeeId required' })
})

it('POST without a day returns 400', async () => {
  const res = await POST(req('http://x/api/requests', { method: 'POST', body: JSON.stringify({ employeeId: 'e1' }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'day required' })
})

it('PUT approves a request', async () => {
  const res = await PUT(
    req('http://x/api/requests?id=r2', { method: 'PUT', body: JSON.stringify({ status: 'approved' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('approved')
})

it('PUT ignores an invalid status', async () => {
  const res = await PUT(
    req('http://x/api/requests?id=r2', { method: 'PUT', body: JSON.stringify({ status: 'maybe' }) }),
  )
  const body = await res.json()
  expect(body.status).toBe('pending')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/requests?id=nope', { method: 'PUT', body: JSON.stringify({ status: 'approved' }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a request', async () => {
  const del = await DELETE(req('http://x/api/requests?id=r1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/requests'))
  const body = await res.json()
  expect(body.requests.map((r: { id: string }) => r.id)).toEqual(['r2', 'r3', 'r4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/requests?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
