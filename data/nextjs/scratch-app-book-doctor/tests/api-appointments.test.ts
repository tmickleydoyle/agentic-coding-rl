import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/appointments/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded appointments', async () => {
  const res = await GET(req('http://x/api/appointments'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.appointments.map((a: { id: string }) => a.id)).toEqual(['a1', 'a2'])
})

it('GET filters by providerId', async () => {
  const res = await GET(req('http://x/api/appointments?providerId=p1'))
  const body = await res.json()
  expect(body.appointments.map((a: { id: string }) => a.id)).toEqual(['a1'])
})

it('GET filters upcoming vs past', async () => {
  const up = await (await GET(req('http://x/api/appointments?when=upcoming'))).json()
  expect(up.appointments.map((a: { id: string }) => a.id)).toEqual(['a1'])
  const past = await (await GET(req('http://x/api/appointments?when=past'))).json()
  expect(past.appointments.map((a: { id: string }) => a.id)).toEqual(['a2'])
})

it('POST creates an appointment on an open slot and returns 201', async () => {
  const res = await POST(
    req('http://x/api/appointments', {
      method: 'POST',
      body: JSON.stringify({ providerId: 'p1', date: '2026-06-12', patient: 'Linus' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('a3')
  expect(body.providerId).toBe('p1')
  expect(body.date).toBe('2026-06-12')
})

it('POST with a missing field returns 400', async () => {
  const res = await POST(
    req('http://x/api/appointments', {
      method: 'POST',
      body: JSON.stringify({ providerId: 'p1', date: '2026-06-12' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid appointment' })
})

it('POST on a date not in the provider slots returns 422', async () => {
  const res = await POST(
    req('http://x/api/appointments', {
      method: 'POST',
      body: JSON.stringify({ providerId: 'p1', date: '2026-07-01', patient: 'Nope' }),
    }),
  )
  expect(res.status).toBe(422)
  expect(await res.json()).toEqual({ error: 'slot unavailable' })
})

it('POST to an unknown provider returns 422', async () => {
  const res = await POST(
    req('http://x/api/appointments', {
      method: 'POST',
      body: JSON.stringify({ providerId: 'zzz', date: '2026-06-12', patient: 'Nobody' }),
    }),
  )
  expect(res.status).toBe(422)
})

it('POST onto an already-booked slot returns 409', async () => {
  const res = await POST(
    req('http://x/api/appointments', {
      method: 'POST',
      body: JSON.stringify({ providerId: 'p1', date: '2026-06-10', patient: 'Late' }),
    }),
  )
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'slot taken' })
})

it('DELETE removes an appointment', async () => {
  const del = await DELETE(req('http://x/api/appointments?id=a1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/appointments'))
  const body = await res.json()
  expect(body.appointments.map((a: { id: string }) => a.id)).toEqual(['a2'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/appointments?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
