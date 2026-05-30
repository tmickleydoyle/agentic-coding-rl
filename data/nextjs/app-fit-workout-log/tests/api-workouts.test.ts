import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/workouts/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded workouts', async () => {
  const res = await GET(req('http://x/api/workouts'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.workouts.map((w: { id: string }) => w.id)).toEqual(['w1', 'w2'])
})

it('GET by id returns a single workout', async () => {
  const res = await GET(req('http://x/api/workouts?id=w1'))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.name).toBe('Push Day')
})

it('GET by missing id returns 404', async () => {
  const res = await GET(req('http://x/api/workouts?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('GET record returns the best weight for an exercise', async () => {
  const res = await GET(req('http://x/api/workouts?record=e2'))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body).toEqual({ exerciseId: 'e2', record: 150 })
})

it('POST creates a workout and returns 201', async () => {
  const res = await POST(
    req('http://x/api/workouts', {
      method: 'POST',
      body: JSON.stringify({ name: 'Pull Day', date: '2026-05-05' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Pull Day')
  expect(body.date).toBe('2026-05-05')
  expect(body.id).toBe('w3')
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/workouts', { method: 'POST', body: JSON.stringify({ date: '2026-05-05' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('a created workout then appears in GET', async () => {
  await POST(req('http://x/api/workouts', { method: 'POST', body: JSON.stringify({ name: 'Cardio' }) }))
  const res = await GET(req('http://x/api/workouts'))
  const body = await res.json()
  expect(body.workouts.map((w: { name: string }) => w.name)).toContain('Cardio')
})

it('DELETE removes a workout', async () => {
  const del = await DELETE(req('http://x/api/workouts?id=w1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/workouts'))
  const body = await res.json()
  expect(body.workouts.map((w: { id: string }) => w.id)).toEqual(['w2'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/workouts?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
