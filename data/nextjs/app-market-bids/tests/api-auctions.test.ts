import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/auctions/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded auctions', async () => {
  const res = await GET(req('http://x/api/auctions'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.auctions.map((a: { id: string }) => a.id)).toEqual(['a1', 'a2', 'a3'])
})

it('GET ?open=true returns only open auctions', async () => {
  const res = await GET(req('http://x/api/auctions?open=true'))
  const body = await res.json()
  expect(body.auctions.map((a: { id: string }) => a.id)).toEqual(['a1', 'a3'])
})

it('POST creates an auction and returns 201', async () => {
  const res = await POST(
    req('http://x/api/auctions', {
      method: 'POST',
      body: JSON.stringify({ title: 'Antique vase', startBid: 10, hoursLeft: 12 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('Antique vase')
  expect(body.currentBid).toBe(10)
  expect(body.highBidder).toBe(null)
  expect(body.closed).toBe(false)
  expect(body.id).toBe('a4')
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/auctions', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})
