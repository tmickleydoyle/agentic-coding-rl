import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/bookings/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded bookings', async () => {
  const res = await GET(req('http://x/api/bookings'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.bookings.map((b: { id: string }) => b.id)).toEqual(['b1', 'b2'])
})

it('GET filters by serviceId', async () => {
  const res = await GET(req('http://x/api/bookings?serviceId=s1'))
  const body = await res.json()
  expect(body.bookings.map((b: { id: string }) => b.id)).toEqual(['b1'])
})

it('GET filters by slot', async () => {
  const res = await GET(req('http://x/api/bookings?slot=10:00'))
  const body = await res.json()
  expect(body.bookings.map((b: { id: string }) => b.id)).toEqual(['b2'])
})

it('POST creates a booking and returns 201', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ serviceId: 's3', slot: '11:00', customer: 'Linus' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('b3')
  expect(body.serviceId).toBe('s3')
  expect(body.slot).toBe('11:00')
  expect(body.customer).toBe('Linus')
})

it('POST with a missing field returns 400', async () => {
  const res = await POST(
    req('http://x/api/bookings', { method: 'POST', body: JSON.stringify({ serviceId: 's1', slot: '11:00' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid booking' })
})

it('POST with a blank customer returns 400', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ serviceId: 's1', slot: '11:00', customer: '   ' }),
    }),
  )
  expect(res.status).toBe(400)
})

it('POST into a taken slot returns 409', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ serviceId: 's1', slot: '09:00', customer: 'Late' }),
    }),
  )
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'slot taken' })
})

it('the same slot is allowed for a different service', async () => {
  const res = await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ serviceId: 's2', slot: '09:00', customer: 'Other' }),
    }),
  )
  expect(res.status).toBe(201)
})

it('a created booking then appears in GET', async () => {
  await POST(
    req('http://x/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ serviceId: 's3', slot: '14:00', customer: 'Margaret' }),
    }),
  )
  const res = await GET(req('http://x/api/bookings'))
  const body = await res.json()
  expect(body.bookings.map((b: { id: string }) => b.id)).toEqual(['b1', 'b2', 'b3'])
})

it('DELETE removes a booking', async () => {
  const del = await DELETE(req('http://x/api/bookings?id=b1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/bookings'))
  const body = await res.json()
  expect(body.bookings.map((b: { id: string }) => b.id)).toEqual(['b2'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/bookings?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
