import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/steps/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists entries and the goal', async () => {
  const res = await GET(req('http://x/api/steps'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.entries.map((e: { id: string }) => e.id)).toEqual(['s1', 's2', 's3'])
  expect(body.goal).toBe(10000)
})

it('POST creates an entry for a new date and returns 201', async () => {
  const res = await POST(
    req('http://x/api/steps', { method: 'POST', body: JSON.stringify({ date: '2026-05-28', steps: 9000 }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('s4')
  expect(body.steps).toBe(9000)
})

it('POST upserts an existing date instead of duplicating', async () => {
  const res = await POST(
    req('http://x/api/steps', { method: 'POST', body: JSON.stringify({ date: '2026-05-26', steps: 9999 }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('s2')
  expect(body.steps).toBe(9999)
  const list = await (await GET(req('http://x/api/steps'))).json()
  expect(list.entries.length).toBe(3)
})

it('POST without a date returns 400', async () => {
  const res = await POST(req('http://x/api/steps', { method: 'POST', body: JSON.stringify({ steps: 100 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'date required' })
})

it('POST with invalid steps returns 400', async () => {
  const res = await POST(
    req('http://x/api/steps', { method: 'POST', body: JSON.stringify({ date: '2026-05-28', steps: -5 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'steps invalid' })
})

it('PUT updates the goal', async () => {
  const res = await PUT(req('http://x/api/steps', { method: 'PUT', body: JSON.stringify({ goal: 8000 }) }))
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ goal: 8000 })
  const list = await (await GET(req('http://x/api/steps'))).json()
  expect(list.goal).toBe(8000)
})

it('PUT with an invalid goal returns 400', async () => {
  const res = await PUT(req('http://x/api/steps', { method: 'PUT', body: JSON.stringify({ goal: 0 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'goal invalid' })
})

it('DELETE removes an entry', async () => {
  const del = await DELETE(req('http://x/api/steps?id=s1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const list = await (await GET(req('http://x/api/steps'))).json()
  expect(list.entries.map((e: { id: string }) => e.id)).toEqual(['s2', 's3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/steps?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
