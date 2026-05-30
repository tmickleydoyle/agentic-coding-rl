import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PATCH, __reset } from '../app/api/cards/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded cards', async () => {
  const res = await GET(req('http://x/api/cards'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.cards.map((c: { id: string }) => c.id)).toEqual(['k1', 'k2', 'k3'])
})

it('POST creates a card and returns 201', async () => {
  const res = await POST(
    req('http://x/api/cards', {
      method: 'POST',
      body: JSON.stringify({ label: 'New Card', last4: '9999', limit: 750 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('k4')
  expect(body.frozen).toBe(false)
  expect(body.last4).toBe('9999')
  expect(body.limit).toBe(750)
})

it('POST with a blank label returns 400', async () => {
  const res = await POST(
    req('http://x/api/cards', {
      method: 'POST',
      body: JSON.stringify({ label: '  ', last4: '9999' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'label required' })
})

it('POST with an invalid last4 returns 400', async () => {
  const res = await POST(
    req('http://x/api/cards', {
      method: 'POST',
      body: JSON.stringify({ label: 'Bad', last4: '12' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid last4' })
})

it('PATCH freezes a card', async () => {
  const res = await PATCH(
    req('http://x/api/cards?id=k1', {
      method: 'PATCH',
      body: JSON.stringify({ frozen: true }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.frozen).toBe(true)
})

it('PATCH updates a limit', async () => {
  const res = await PATCH(
    req('http://x/api/cards?id=k2', {
      method: 'PATCH',
      body: JSON.stringify({ limit: 3000 }),
    }),
  )
  const body = await res.json()
  expect(body.limit).toBe(3000)
})

it('PATCH on a missing id returns 404', async () => {
  const res = await PATCH(
    req('http://x/api/cards?id=nope', {
      method: 'PATCH',
      body: JSON.stringify({ frozen: true }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
