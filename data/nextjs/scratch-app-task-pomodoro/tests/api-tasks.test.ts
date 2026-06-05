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

it('GET filters by done=true', async () => {
  const res = await GET(req('http://x/api/tasks?done=true'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t3'])
})

it('GET filters by done=false', async () => {
  const res = await GET(req('http://x/api/tasks?done=false'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t1', 't2'])
})

it('POST creates a task and returns 201', async () => {
  const res = await POST(
    req('http://x/api/tasks', { method: 'POST', body: JSON.stringify({ title: 'New one' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('New one')
  expect(body.sessions).toBe(0)
  expect(body.done).toBe(false)
  expect(body.id).toBe('t4')
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/tasks', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT increments the session count when session:true', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=t1', { method: 'PUT', body: JSON.stringify({ session: true }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.sessions).toBe(3)
})

it('PUT sets done explicitly', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=t1', { method: 'PUT', body: JSON.stringify({ done: true }) }),
  )
  const body = await res.json()
  expect(body.done).toBe(true)
})

it('PUT toggles done when no key is given', async () => {
  const res = await PUT(req('http://x/api/tasks?id=t1', { method: 'PUT', body: JSON.stringify({}) }))
  const body = await res.json()
  expect(body.done).toBe(true)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=zzz', { method: 'PUT', body: JSON.stringify({ done: true }) }),
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
