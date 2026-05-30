import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PATCH, DELETE, __reset } from '../app/api/pots/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded pots', async () => {
  const res = await GET(req('http://x/api/pots'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.pots.map((p: { id: string }) => p.id)).toEqual(['p1', 'p2', 'p3'])
})

it('POST creates a pot with balance 0 and returns 201', async () => {
  const res = await POST(
    req('http://x/api/pots', {
      method: 'POST',
      body: JSON.stringify({ name: 'Car', goal: 5000 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('p4')
  expect(body.balance).toBe(0)
  expect(body.goal).toBe(5000)
})

it('POST defaults a missing goal to 0', async () => {
  const res = await POST(
    req('http://x/api/pots', {
      method: 'POST',
      body: JSON.stringify({ name: 'Misc' }),
    }),
  )
  const body = await res.json()
  expect(body.goal).toBe(0)
})

it('POST with a blank name returns 400', async () => {
  const res = await POST(
    req('http://x/api/pots', {
      method: 'POST',
      body: JSON.stringify({ name: '  ', goal: 100 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('PATCH updates a pot balance', async () => {
  const res = await PATCH(
    req('http://x/api/pots?id=p1', {
      method: 'PATCH',
      body: JSON.stringify({ balance: 2000 }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.balance).toBe(2000)
})

it('PATCH ignores a negative balance', async () => {
  const res = await PATCH(
    req('http://x/api/pots?id=p1', {
      method: 'PATCH',
      body: JSON.stringify({ balance: -50 }),
    }),
  )
  const body = await res.json()
  expect(body.balance).toBe(1500)
})

it('PATCH on a missing id returns 404', async () => {
  const res = await PATCH(
    req('http://x/api/pots?id=nope', {
      method: 'PATCH',
      body: JSON.stringify({ goal: 1 }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a pot', async () => {
  const del = await DELETE(req('http://x/api/pots?id=p2', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/pots'))
  const body = await res.json()
  expect(body.pots.map((p: { id: string }) => p.id)).toEqual(['p1', 'p3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/pots?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
