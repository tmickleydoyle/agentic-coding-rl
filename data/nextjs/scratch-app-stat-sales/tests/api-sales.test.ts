import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/sales/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded orders', async () => {
  const res = await GET(req('http://x/api/sales'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['o1', 'o2', 'o3', 'o4', 'o5', 'o6'])
})

it('GET filters by region', async () => {
  const res = await GET(req('http://x/api/sales?region=NA'))
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['o1', 'o3'])
})

it('GET filters by product', async () => {
  const res = await GET(req('http://x/api/sales?product=Widget'))
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['o1', 'o2', 'o6'])
})

it('GET combines region and product filters', async () => {
  const res = await GET(req('http://x/api/sales?region=APAC&product=Widget'))
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['o6'])
})

it('GET summary=region returns per-region rollups in fixed order', async () => {
  const res = await GET(req('http://x/api/sales?summary=region'))
  const body = await res.json()
  expect(body.summary).toEqual([
    { region: 'NA', revenue: 1800, units: 14 },
    { region: 'EU', revenue: 800, units: 8 },
    { region: 'APAC', revenue: 1900, units: 13 },
  ])
})

it('GET summary=product returns per-product rollups sorted by revenue', async () => {
  const res = await GET(req('http://x/api/sales?summary=product'))
  const body = await res.json()
  expect(body.summary).toEqual([
    { product: 'Widget', revenue: 2200, units: 22 },
    { product: 'Gadget', revenue: 2000, units: 10 },
    { product: 'Gizmo', revenue: 300, units: 3 },
  ])
})

it('GET summary respects an active filter', async () => {
  const res = await GET(req('http://x/api/sales?region=NA&summary=product'))
  const body = await res.json()
  expect(body.summary).toEqual([
    { product: 'Widget', revenue: 1000, units: 10 },
    { product: 'Gadget', revenue: 800, units: 4 },
  ])
})

it('POST creates an order and returns 201', async () => {
  const res = await POST(
    req('http://x/api/sales', {
      method: 'POST',
      body: JSON.stringify({ product: 'Bolt', region: 'EU', revenue: 250, units: 9, month: 'Mar' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('o7')
  expect(body.product).toBe('Bolt')
  expect(body.region).toBe('EU')
  expect(body.revenue).toBe(250)
})

it('POST defaults revenue/units/month', async () => {
  const res = await POST(
    req('http://x/api/sales', { method: 'POST', body: JSON.stringify({ product: 'X', region: 'NA' }) }),
  )
  const body = await res.json()
  expect(body.revenue).toBe(0)
  expect(body.units).toBe(0)
  expect(body.month).toBe('Jan')
})

it('POST without a product returns 400', async () => {
  const res = await POST(
    req('http://x/api/sales', { method: 'POST', body: JSON.stringify({ region: 'NA' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'product required' })
})

it('POST with an invalid region returns 400', async () => {
  const res = await POST(
    req('http://x/api/sales', { method: 'POST', body: JSON.stringify({ product: 'X', region: 'MARS' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'valid region required' })
})

it('DELETE removes an order', async () => {
  const del = await DELETE(req('http://x/api/sales?id=o1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/sales'))
  const body = await res.json()
  expect(body.orders.map((o: { id: string }) => o.id)).toEqual(['o2', 'o3', 'o4', 'o5', 'o6'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/sales?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
