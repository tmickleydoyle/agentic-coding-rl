import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/meals/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded meals', async () => {
  const res = await GET(req('http://x/api/meals'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.meals.map((m: { id: string }) => m.id)).toEqual(['m1', 'm2', 'm3'])
})

it('GET filters by date', async () => {
  const res = await GET(req('http://x/api/meals?date=2026-05-28'))
  const body = await res.json()
  expect(body.meals.map((m: { id: string }) => m.id)).toEqual(['m3'])
})

it('POST creates a meal and returns 201', async () => {
  const res = await POST(
    req('http://x/api/meals', {
      method: 'POST',
      body: JSON.stringify({ name: 'Toast', calories: 150, protein: 5, date: '2026-05-29' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Toast')
  expect(body.calories).toBe(150)
  expect(body.protein).toBe(5)
  expect(body.id).toBe('m4')
})

it('POST defaults missing macros to 0', async () => {
  const res = await POST(
    req('http://x/api/meals', { method: 'POST', body: JSON.stringify({ name: 'Water', calories: 0 }) }),
  )
  const body = await res.json()
  expect(body.protein).toBe(0)
  expect(body.carbs).toBe(0)
  expect(body.fat).toBe(0)
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/meals', { method: 'POST', body: JSON.stringify({ calories: 100 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST without calories returns 400', async () => {
  const res = await POST(
    req('http://x/api/meals', { method: 'POST', body: JSON.stringify({ name: 'Mystery' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'calories required' })
})

it('POST with negative calories returns 400', async () => {
  const res = await POST(
    req('http://x/api/meals', { method: 'POST', body: JSON.stringify({ name: 'Bad', calories: -5 }) }),
  )
  expect(res.status).toBe(400)
})

it('a created meal then appears in GET', async () => {
  await POST(req('http://x/api/meals', { method: 'POST', body: JSON.stringify({ name: 'Rice', calories: 200 }) }))
  const res = await GET(req('http://x/api/meals'))
  const body = await res.json()
  expect(body.meals.map((m: { name: string }) => m.name)).toContain('Rice')
})

it('DELETE removes a meal', async () => {
  const del = await DELETE(req('http://x/api/meals?id=m1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/meals'))
  const body = await res.json()
  expect(body.meals.map((m: { id: string }) => m.id)).toEqual(['m2', 'm3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/meals?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
