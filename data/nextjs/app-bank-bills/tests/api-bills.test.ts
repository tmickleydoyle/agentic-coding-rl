import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PATCH, __reset } from '../app/api/bills/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded bills', async () => {
  const res = await GET(req('http://x/api/bills'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.bills.map((b: { id: string }) => b.id)).toEqual(['b1', 'b2', 'b3', 'b4'])
})

it('GET ?unpaid=true returns only unpaid bills', async () => {
  const res = await GET(req('http://x/api/bills?unpaid=true'))
  const body = await res.json()
  expect(body.bills.map((b: { id: string }) => b.id)).toEqual(['b1', 'b3', 'b4'])
})

it('POST creates an unpaid bill and returns 201', async () => {
  const res = await POST(
    req('http://x/api/bills', {
      method: 'POST',
      body: JSON.stringify({ name: 'Water', amount: 40, dueDay: 12, autopay: true }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('b5')
  expect(body.paid).toBe(false)
  expect(body.autopay).toBe(true)
  expect(body.dueDay).toBe(12)
})

it('POST with a blank name returns 400', async () => {
  const res = await POST(
    req('http://x/api/bills', {
      method: 'POST',
      body: JSON.stringify({ name: '  ', amount: 40, dueDay: 12 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST with a non-positive amount returns 400', async () => {
  const res = await POST(
    req('http://x/api/bills', {
      method: 'POST',
      body: JSON.stringify({ name: 'Water', amount: 0, dueDay: 12 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'amount must be positive' })
})

it('POST with an invalid due day returns 400', async () => {
  const res = await POST(
    req('http://x/api/bills', {
      method: 'POST',
      body: JSON.stringify({ name: 'Water', amount: 40, dueDay: 32 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid due day' })
})

it('PATCH marks a bill paid', async () => {
  const res = await PATCH(
    req('http://x/api/bills?id=b1', {
      method: 'PATCH',
      body: JSON.stringify({ paid: true }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.paid).toBe(true)
  const list = await (await GET(req('http://x/api/bills?unpaid=true'))).json()
  expect(list.bills.map((b: { id: string }) => b.id)).toEqual(['b3', 'b4'])
})

it('PATCH toggles autopay', async () => {
  const res = await PATCH(
    req('http://x/api/bills?id=b4', {
      method: 'PATCH',
      body: JSON.stringify({ autopay: true }),
    }),
  )
  const body = await res.json()
  expect(body.autopay).toBe(true)
})

it('PATCH on a missing id returns 404', async () => {
  const res = await PATCH(
    req('http://x/api/bills?id=nope', {
      method: 'PATCH',
      body: JSON.stringify({ paid: true }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
