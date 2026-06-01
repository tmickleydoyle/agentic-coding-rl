import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/accounts/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded accounts', async () => {
  const res = await GET(req('http://x/api/accounts'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.accounts.map((a: { id: string }) => a.id)).toEqual(['a1', 'a2', 'a3'])
})

it('POST creates an account and returns 201', async () => {
  const res = await POST(
    req('http://x/api/accounts', {
      method: 'POST',
      body: JSON.stringify({ name: 'Vacation', kind: 'savings', balance: 300 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('a4')
  expect(body.name).toBe('Vacation')
  expect(body.kind).toBe('savings')
  expect(body.balance).toBe(300)
})

it('POST defaults kind to checking and balance to 0', async () => {
  const res = await POST(
    req('http://x/api/accounts', {
      method: 'POST',
      body: JSON.stringify({ name: 'Bare' }),
    }),
  )
  const body = await res.json()
  expect(body.kind).toBe('checking')
  expect(body.balance).toBe(0)
})

it('POST with a blank name returns 400', async () => {
  const res = await POST(
    req('http://x/api/accounts', {
      method: 'POST',
      body: JSON.stringify({ name: '   ' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST with an invalid kind returns 400', async () => {
  const res = await POST(
    req('http://x/api/accounts', {
      method: 'POST',
      body: JSON.stringify({ name: 'Bad', kind: 'crypto' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid kind' })
})
