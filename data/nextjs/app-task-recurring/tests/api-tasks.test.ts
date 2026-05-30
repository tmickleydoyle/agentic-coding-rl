import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/tasks/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded tasks', async () => {
  const res = await GET(req('http://x/api/tasks'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t1', 't2', 't3'])
})

it('GET filters due=true (nextDue <= today)', async () => {
  const res = await GET(req('http://x/api/tasks?due=true'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t1', 't2'])
})

it('GET filters by schedule', async () => {
  const res = await GET(req('http://x/api/tasks?schedule=weekly'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t3'])
})

it('POST creates a daily task due today and returns 201', async () => {
  const res = await POST(
    req('http://x/api/tasks', { method: 'POST', body: JSON.stringify({ title: 'Floss' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('Floss')
  expect(body.schedule).toBe('daily')
  expect(body.nextDue).toBe('2026-05-29')
  expect(body.id).toBe('t4')
})

it('POST accepts a weekly schedule', async () => {
  const res = await POST(
    req('http://x/api/tasks', { method: 'POST', body: JSON.stringify({ title: 'Plan', schedule: 'weekly' }) }),
  )
  const body = await res.json()
  expect(body.schedule).toBe('weekly')
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/tasks', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('POST with an invalid schedule returns 400', async () => {
  const res = await POST(
    req('http://x/api/tasks', { method: 'POST', body: JSON.stringify({ title: 'X', schedule: 'monthly' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid schedule' })
})

it('PUT complete advances a daily task by one day', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=t1', { method: 'PUT', body: JSON.stringify({ complete: true }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.nextDue).toBe('2026-05-30')
})

it('PUT complete advances a weekly task by seven days', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=t3', { method: 'PUT', body: JSON.stringify({ complete: true }) }),
  )
  const body = await res.json()
  // weekly: today 2026-05-29 + 7 = 2026-06-05
  expect(body.nextDue).toBe('2026-06-05')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=zzz', { method: 'PUT', body: JSON.stringify({ complete: true }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a task', async () => {
  const del = await DELETE(req('http://x/api/tasks?id=t1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/tasks'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t2', 't3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/tasks?id=zzz', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
