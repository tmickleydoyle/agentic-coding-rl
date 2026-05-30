import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/routines/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded routines', async () => {
  const res = await GET(req('http://x/api/routines'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.routines.map((r: { id: string }) => r.id)).toEqual(['r1', 'r2', 'r3'])
})

it('GET by id returns a single routine', async () => {
  const res = await GET(req('http://x/api/routines?id=r1'))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.name).toBe('Upper Body')
  expect(body.exerciseIds).toEqual(['x1', 'x2'])
})

it('GET by missing id returns 404', async () => {
  const res = await GET(req('http://x/api/routines?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST creates a routine and returns 201', async () => {
  const res = await POST(
    req('http://x/api/routines', {
      method: 'POST',
      body: JSON.stringify({ name: 'Cardio', exerciseIds: ['x1'] }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Cardio')
  expect(body.exerciseIds).toEqual(['x1'])
  expect(body.day).toBe(null)
  expect(body.id).toBe('r4')
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/routines', { method: 'POST', body: JSON.stringify({ exerciseIds: ['x1'] }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('PUT assigns a weekday', async () => {
  const res = await PUT(
    req('http://x/api/routines?id=r3', { method: 'PUT', body: JSON.stringify({ day: 'fri' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.day).toBe('fri')
})

it('PUT can clear the day with null', async () => {
  const res = await PUT(
    req('http://x/api/routines?id=r1', { method: 'PUT', body: JSON.stringify({ day: null }) }),
  )
  const body = await res.json()
  expect(body.day).toBe(null)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/routines?id=nope', { method: 'PUT', body: JSON.stringify({ day: 'mon' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a routine', async () => {
  const del = await DELETE(req('http://x/api/routines?id=r1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/routines'))
  const body = await res.json()
  expect(body.routines.map((r: { id: string }) => r.id)).toEqual(['r2', 'r3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/routines?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
