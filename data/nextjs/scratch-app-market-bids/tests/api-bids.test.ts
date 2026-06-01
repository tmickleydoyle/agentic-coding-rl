import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/bids/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded bids', async () => {
  const res = await GET(req('http://x/api/bids'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.bids.map((b: { id: string }) => b.id)).toEqual(['b1'])
})

it('GET filters bids by auctionId', async () => {
  const res = await GET(req('http://x/api/bids?auctionId=a1'))
  const body = await res.json()
  expect(body.bids).toEqual([])
})

it('POST places a valid bid and returns 201', async () => {
  const res = await POST(
    req('http://x/api/bids', {
      method: 'POST',
      body: JSON.stringify({ auctionId: 'a1', bidder: 'frank', amount: 60 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('b2')
  expect(body.amount).toBe(60)
})

it('POST a bid then appears in GET filtered by auction', async () => {
  await POST(
    req('http://x/api/bids', {
      method: 'POST',
      body: JSON.stringify({ auctionId: 'a1', bidder: 'frank', amount: 60 }),
    }),
  )
  const res = await GET(req('http://x/api/bids?auctionId=a1'))
  const body = await res.json()
  expect(body.bids.map((b: { amount: number }) => b.amount)).toEqual([60])
})

it('POST a too-low bid returns 400', async () => {
  const res = await POST(
    req('http://x/api/bids', {
      method: 'POST',
      body: JSON.stringify({ auctionId: 'a1', bidder: 'frank', amount: 50 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'bid too low' })
})

it('POST a bid on a closed auction returns 409', async () => {
  const res = await POST(
    req('http://x/api/bids', {
      method: 'POST',
      body: JSON.stringify({ auctionId: 'a2', bidder: 'frank', amount: 100 }),
    }),
  )
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'auction closed' })
})

it('POST a bid on an unknown auction returns 404', async () => {
  const res = await POST(
    req('http://x/api/bids', {
      method: 'POST',
      body: JSON.stringify({ auctionId: 'nope', bidder: 'frank', amount: 100 }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
