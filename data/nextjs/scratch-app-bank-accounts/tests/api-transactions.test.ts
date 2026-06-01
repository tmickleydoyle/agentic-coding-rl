import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/transactions/route'
import { GET as ACCOUNTS_GET } from '../app/api/accounts/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

const balanceOf = async (id: string): Promise<number> => {
  const res = await ACCOUNTS_GET(req('http://x/api/accounts'))
  const body = await res.json()
  return body.accounts.find((a: { id: string }) => a.id === id).balance
}

it('GET lists the seeded transactions', async () => {
  const res = await GET(req('http://x/api/transactions'))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.transactions.map((t: { id: string }) => t.id)).toEqual([
    't1',
    't2',
    't3',
    't4',
    't5',
    't6',
  ])
})

it('GET filters by accountId', async () => {
  const res = await GET(req('http://x/api/transactions?accountId=a2'))
  const body = await res.json()
  expect(body.transactions.map((t: { id: string }) => t.id)).toEqual(['t4', 't5'])
})

it('POST creates a transaction, returns 201, and adjusts the balance', async () => {
  expect(await balanceOf('a3')).toBe(1200)
  const res = await POST(
    req('http://x/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ accountId: 'a3', description: 'Refund', amount: 50 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('t7')
  expect(body.accountId).toBe('a3')
  expect(body.amount).toBe(50)
  expect(await balanceOf('a3')).toBe(1250)
})

it('POST with an unknown account returns 400', async () => {
  const res = await POST(
    req('http://x/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ accountId: 'nope', amount: 10 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid account' })
})

it('POST with a zero amount returns 400', async () => {
  const res = await POST(
    req('http://x/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ accountId: 'a1', amount: 0 }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'amount required' })
})

it('DELETE removes a transaction and reverses its balance effect', async () => {
  expect(await balanceOf('a1')).toBe(2500)
  const del = await DELETE(req('http://x/api/transactions?id=t1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  // t1 was +3200, removing it drops the balance
  expect(await balanceOf('a1')).toBe(2500 - 3200)
  const res = await GET(req('http://x/api/transactions?accountId=a1'))
  const body = await res.json()
  expect(body.transactions.map((t: { id: string }) => t.id)).toEqual(['t2', 't3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/transactions?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
