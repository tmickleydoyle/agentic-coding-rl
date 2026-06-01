import { it, expect, beforeEach } from 'vitest'
import { GET, PUT, __reset } from '../app/api/orders/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded orders', async () => {
  const res = await GET(req('http://x/api/orders'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['o1', 'o2', 'o3'])
})

it('GET ?fulfilled=false returns only pending orders', async () => {
  const res = await GET(req('http://x/api/orders?fulfilled=false'))
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['o2', 'o3'])
})

it('GET ?fulfilled=true returns only fulfilled orders', async () => {
  const res = await GET(req('http://x/api/orders?fulfilled=true'))
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['o1'])
})

it('PUT marks an order fulfilled', async () => {
  const res = await PUT(req('http://x/api/orders?id=o2', { method: 'PUT' }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('o2')
  expect(body.fulfilled).toBe(true)
})

it('PUT then GET shows the order as fulfilled', async () => {
  await PUT(req('http://x/api/orders?id=o2', { method: 'PUT' }))
  const res = await GET(req('http://x/api/orders?fulfilled=true'))
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['o1', 'o2'])
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/orders?id=nope', { method: 'PUT' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
