import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/charges/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded charges', async () => {
  const res = await GET(req('http://x/api/charges'))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.charges.map((c: { id: string }) => c.id)).toEqual([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
  ])
})

it('GET filters by cardId', async () => {
  const res = await GET(req('http://x/api/charges?cardId=k2'))
  const body = await res.json()
  expect(body.charges.map((c: { id: string }) => c.id)).toEqual(['h3', 'h4'])
})

it('POST creates a charge and returns 201', async () => {
  const res = await POST(
    req('http://x/api/charges', {
      method: 'POST',
      body: JSON.stringify({ cardId: 'k1', merchant: 'Lunch', amount: 20 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('h6')
  expect(body.cardId).toBe('k1')
  expect(body.amount).toBe(20)
})

it('POST to an unknown card returns 400', async () => {
  const res = await POST(
    req('http://x/api/charges', {
      method: 'POST',
      body: JSON.stringify({ cardId: 'nope', amount: 10 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid card' })
})

it('POST with a non-positive amount returns 400', async () => {
  const res = await POST(
    req('http://x/api/charges', {
      method: 'POST',
      body: JSON.stringify({ cardId: 'k1', amount: 0 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'amount must be positive' })
})

it('POST to a frozen card returns 400', async () => {
  const res = await POST(
    req('http://x/api/charges', {
      method: 'POST',
      body: JSON.stringify({ cardId: 'k3', amount: 10 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'card frozen' })
})
