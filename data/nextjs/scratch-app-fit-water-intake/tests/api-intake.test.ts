import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/intake/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists drinks, goal and reminders', async () => {
  const res = await GET(req('http://x/api/intake'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.drinks.map((d: { id: string }) => d.id)).toEqual(['d1', 'd2', 'd3'])
  expect(body.goal).toBe(2000)
  expect(body.reminders).toBe(4)
})

it('GET by date returns that day total', async () => {
  const res = await GET(req('http://x/api/intake?date=2026-05-27'))
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ date: '2026-05-27', total: 1250 })
})

it('POST creates a drink and returns 201', async () => {
  const res = await POST(
    req('http://x/api/intake', { method: 'POST', body: JSON.stringify({ amount: 300, date: '2026-05-28' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('d4')
  expect(body.amount).toBe(300)
})

it('POST with an invalid amount returns 400', async () => {
  const res = await POST(req('http://x/api/intake', { method: 'POST', body: JSON.stringify({ amount: 0 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'amount invalid' })
})

it('PUT updates the goal', async () => {
  const res = await PUT(req('http://x/api/intake', { method: 'PUT', body: JSON.stringify({ goal: 2500 }) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.goal).toBe(2500)
})

it('PUT updates reminders', async () => {
  const res = await PUT(req('http://x/api/intake', { method: 'PUT', body: JSON.stringify({ reminders: 6 }) }))
  const body = await res.json()
  expect(body.reminders).toBe(6)
})

it('PUT with an invalid goal returns 400', async () => {
  const res = await PUT(req('http://x/api/intake', { method: 'PUT', body: JSON.stringify({ goal: -1 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'goal invalid' })
})

it('DELETE removes a drink', async () => {
  const del = await DELETE(req('http://x/api/intake?id=d1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const list = await (await GET(req('http://x/api/intake'))).json()
  expect(list.drinks.map((d: { id: string }) => d.id)).toEqual(['d2', 'd3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/intake?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
