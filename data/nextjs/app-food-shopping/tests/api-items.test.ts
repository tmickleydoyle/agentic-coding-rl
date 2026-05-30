import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/items/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded items', async () => {
  const res = await GET(req('http://x/api/items'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.items.map((i: { id: string }) => i.id)).toEqual(['i1', 'i2', 'i3', 'i4'])
})

it('GET filters by aisle', async () => {
  const res = await GET(req('http://x/api/items?aisle=Dairy'))
  const body = await res.json()
  expect(body.items.map((i: { id: string }) => i.id)).toEqual(['i1', 'i3'])
})

it('GET filters by bought=true', async () => {
  const res = await GET(req('http://x/api/items?bought=true'))
  const body = await res.json()
  expect(body.items.map((i: { id: string }) => i.id)).toEqual(['i3'])
})

it('POST creates an item and returns 201', async () => {
  const res = await POST(
    req('http://x/api/items', {
      method: 'POST',
      body: JSON.stringify({ name: 'Yogurt', aisle: 'Dairy', qty: 2 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Yogurt')
  expect(body.aisle).toBe('Dairy')
  expect(body.bought).toBe(false)
  expect(body.id).toBe('i5')
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/items', { method: 'POST', body: JSON.stringify({ aisle: 'Produce' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST defaults aisle to Other and qty to 1', async () => {
  const res = await POST(
    req('http://x/api/items', { method: 'POST', body: JSON.stringify({ name: 'Flour' }) }),
  )
  const body = await res.json()
  expect(body.aisle).toBe('Other')
  expect(body.qty).toBe(1)
})

it('PUT toggles bought when no explicit value is given', async () => {
  const res = await PUT(req('http://x/api/items?id=i1', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('i1')
  expect(body.bought).toBe(true)
})

it('PUT sets bought explicitly', async () => {
  const res = await PUT(
    req('http://x/api/items?id=i3', { method: 'PUT', body: JSON.stringify({ bought: false }) }),
  )
  const body = await res.json()
  expect(body.bought).toBe(false)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/items?id=nope', { method: 'PUT', body: JSON.stringify({ bought: true }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes an item', async () => {
  const del = await DELETE(req('http://x/api/items?id=i1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/items'))
  const body = await res.json()
  expect(body.items.map((i: { id: string }) => i.id)).toEqual(['i2', 'i3', 'i4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/items?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
