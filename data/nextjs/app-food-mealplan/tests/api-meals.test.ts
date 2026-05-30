import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/meals/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded assignments', async () => {
  const res = await GET(req('http://x/api/meals'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.assignments.map((a: { id: string }) => a.id)).toEqual(['a1', 'a2'])
})

it('GET filters by day', async () => {
  const res = await GET(req('http://x/api/meals?day=Mon'))
  const body = await res.json()
  expect(body.assignments).toHaveLength(2)
  const res2 = await GET(req('http://x/api/meals?day=Tue'))
  const body2 = await res2.json()
  expect(body2.assignments).toHaveLength(0)
})

it('POST creates an assignment and returns 201', async () => {
  const res = await POST(
    req('http://x/api/meals', {
      method: 'POST',
      body: JSON.stringify({ day: 'Wed', recipeId: 'r3' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.day).toBe('Wed')
  expect(body.recipeId).toBe('r3')
  expect(body.id).toBe('a3')
})

it('POST without a day returns 400', async () => {
  const res = await POST(
    req('http://x/api/meals', { method: 'POST', body: JSON.stringify({ recipeId: 'r1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'day required' })
})

it('POST without a recipeId returns 400', async () => {
  const res = await POST(
    req('http://x/api/meals', { method: 'POST', body: JSON.stringify({ day: 'Thu' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'recipeId required' })
})

it('a created assignment appears in GET', async () => {
  await POST(
    req('http://x/api/meals', {
      method: 'POST',
      body: JSON.stringify({ day: 'Sat', recipeId: 'r2' }),
    }),
  )
  const res = await GET(req('http://x/api/meals?day=Sat'))
  const body = await res.json()
  expect(body.assignments.map((a: { recipeId: string }) => a.recipeId)).toEqual(['r2'])
})

it('DELETE removes an assignment', async () => {
  const del = await DELETE(req('http://x/api/meals?id=a1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/meals'))
  const body = await res.json()
  expect(body.assignments.map((a: { id: string }) => a.id)).toEqual(['a2'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/meals?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
