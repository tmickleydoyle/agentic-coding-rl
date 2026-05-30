import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/bins/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded bins', async () => {
  const res = await GET(req('http://x/api/bins'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.bins.map((b: { id: string }) => b.id)).toEqual(['b1', 'b2', 'b3'])
})

it('GET filters to bins with free space', async () => {
  const res = await GET(req('http://x/api/bins?available=true'))
  const body = await res.json()
  // b2 is full, so excluded
  expect(body.bins.map((b: { id: string }) => b.id)).toEqual(['b1', 'b3'])
})

it('POST creates a bin and returns 201', async () => {
  const res = await POST(
    req('http://x/api/bins', {
      method: 'POST',
      body: JSON.stringify({ code: 'C1', capacity: 60 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.code).toBe('C1')
  expect(body.capacity).toBe(60)
  expect(body.items).toEqual([])
  expect(body.id).toBe('b4')
})

it('POST without a code returns 400', async () => {
  const res = await POST(
    req('http://x/api/bins', { method: 'POST', body: JSON.stringify({ capacity: 10 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'code required' })
})

it('POST with a non-positive capacity returns 400', async () => {
  const res = await POST(
    req('http://x/api/bins', {
      method: 'POST',
      body: JSON.stringify({ code: 'C1', capacity: 0 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'capacity invalid' })
})

it('PUT moves items between bins', async () => {
  const res = await PUT(
    req('http://x/api/bins', {
      method: 'PUT',
      body: JSON.stringify({ from: 'b1', to: 'b3', name: 'Bolts', qty: 10 }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  const b1 = body.bins.find((b: { id: string }) => b.id === 'b1')
  const b3 = body.bins.find((b: { id: string }) => b.id === 'b3')
  expect(b1.items.find((i: { name: string }) => i.name === 'Bolts').qty).toBe(30)
  expect(b3.items.find((i: { name: string }) => i.name === 'Bolts').qty).toBe(10)
})

it('PUT rejects a move with a non-positive qty', async () => {
  const res = await PUT(
    req('http://x/api/bins', {
      method: 'PUT',
      body: JSON.stringify({ from: 'b1', to: 'b3', name: 'Bolts', qty: 0 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'qty invalid' })
})

it('PUT returns 404 for an unknown bin', async () => {
  const res = await PUT(
    req('http://x/api/bins', {
      method: 'PUT',
      body: JSON.stringify({ from: 'b1', to: 'nope', name: 'Bolts', qty: 1 }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('PUT returns 409 when destination lacks space', async () => {
  const res = await PUT(
    req('http://x/api/bins', {
      method: 'PUT',
      body: JSON.stringify({ from: 'b1', to: 'b2', name: 'Bolts', qty: 5 }),
    }),
  )
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'not enough space' })
})

it('PUT returns 409 when source lacks stock', async () => {
  const res = await PUT(
    req('http://x/api/bins', {
      method: 'PUT',
      body: JSON.stringify({ from: 'b1', to: 'b3', name: 'Bolts', qty: 999 }),
    }),
  )
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'not enough stock' })
})
