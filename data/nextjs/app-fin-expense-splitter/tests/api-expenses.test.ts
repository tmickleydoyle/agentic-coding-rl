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

it('GET filters by paidBy', async () => {
  const res = await GET(req('http://x/api/expenses?paidBy=u1'))
  const body = await res.json()
  expect(body.expenses.map((e: { id: string }) => e.id)).toEqual(['e1', 'e3'])
})

it('POST creates an expense and returns 201', async () => {
  const res = await POST(
    req('http://x/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ description: 'Drinks', amount: 24, paidBy: 'u2' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.description).toBe('Drinks')
  expect(body.amount).toBe(24)
  expect(body.paidBy).toBe('u2')
  expect(body.id).toBe('e4')
})

it('POST without a description returns 400', async () => {
  const res = await POST(
    req('http://x/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ amount: 10, paidBy: 'u1' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'description required' })
})

it('POST with a non-positive amount returns 400', async () => {
  const res = await POST(
    req('http://x/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ description: 'Bad', amount: 0, paidBy: 'u1' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'amount must be positive' })
})

it('POST with an unknown payer returns 400', async () => {
  const res = await POST(
    req('http://x/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ description: 'Ghost', amount: 10, paidBy: 'nope' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid payer' })
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
