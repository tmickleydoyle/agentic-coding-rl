import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/transactions/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded transactions', async () => {
  const res = await GET(req('http://x/api/transactions'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.transactions.map((t: { id: string }) => t.id)).toEqual([
    't1',
    't2',
    't3',
    't4',
    't5',
  ])
})

it('GET filters by categoryId', async () => {
  const res = await GET(req('http://x/api/transactions?categoryId=c1'))
  const body = await res.json()
  expect(body.transactions.map((t: { id: string }) => t.id)).toEqual(['t1', 't2'])
})

it('POST creates a transaction and returns 201', async () => {
  const res = await POST(
    req('http://x/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ categoryId: 'c3', description: 'Gas', amount: 45 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('t6')
  expect(body.categoryId).toBe('c3')
  expect(body.amount).toBe(45)
  expect(body.description).toBe('Gas')
})

it('POST with an unknown category returns 400', async () => {
  const res = await POST(
    req('http://x/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ categoryId: 'nope', amount: 10 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid category' })
})

it('POST with a non-positive amount returns 400', async () => {
  const res = await POST(
    req('http://x/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ categoryId: 'c1', amount: -5 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'amount must be positive' })
})

it('DELETE removes a transaction', async () => {
  const del = await DELETE(req('http://x/api/transactions?id=t1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/transactions?categoryId=c1'))
  const body = await res.json()
  expect(body.transactions.map((t: { id: string }) => t.id)).toEqual(['t2'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/transactions?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
