import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/expenses/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded expenses', async () => {
  const res = await GET(req('http://x/api/expenses'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.expenses.map((e: { id: string }) => e.id)).toEqual(['e1', 'e2', 'e3'])
})

it('GET filters by categoryId', async () => {
  const res = await GET(req('http://x/api/expenses?categoryId=c2'))
  const body = await res.json()
  expect(body.expenses.map((e: { id: string }) => e.id)).toEqual(['e2', 'e3'])
})

it('POST creates an expense and returns 201', async () => {
  const res = await POST(
    req('http://x/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ categoryId: 'c3', amount: 45, note: 'Bus pass' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.categoryId).toBe('c3')
  expect(body.amount).toBe(45)
  expect(body.note).toBe('Bus pass')
  expect(body.id).toBe('e4')
})

it('POST with an unknown category returns 400', async () => {
  const res = await POST(
    req('http://x/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ categoryId: 'nope', amount: 10 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid category' })
})

it('POST with a non-positive amount returns 400', async () => {
  const res = await POST(
    req('http://x/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ categoryId: 'c1', amount: -5 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'amount must be positive' })
})

it('DELETE removes an expense', async () => {
  const del = await DELETE(req('http://x/api/expenses?id=e1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/expenses'))
  const body = await res.json()
  expect(body.expenses.map((e: { id: string }) => e.id)).toEqual(['e2', 'e3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/expenses?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
