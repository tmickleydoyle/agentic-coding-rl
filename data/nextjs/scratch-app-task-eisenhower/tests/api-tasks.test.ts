import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/tasks/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded tasks', async () => {
  const res = await GET(req('http://x/api/tasks'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t1', 't2', 't3', 't4'])
})

it('GET filters by quadrant', async () => {
  const res = await GET(req('http://x/api/tasks?quadrant=schedule'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t2'])
})

it('GET with an invalid quadrant returns 400', async () => {
  const res = await GET(req('http://x/api/tasks?quadrant=nope'))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid quadrant' })
})

it('POST creates a task with flags and returns 201', async () => {
  const res = await POST(
    req('http://x/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'New one', urgent: true, important: true }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('New one')
  expect(body.urgent).toBe(true)
  expect(body.important).toBe(true)
  expect(body.id).toBe('t5')
})

it('POST defaults flags to false', async () => {
  const res = await POST(
    req('http://x/api/tasks', { method: 'POST', body: JSON.stringify({ title: 'Plain' }) }),
  )
  const body = await res.json()
  expect(body.urgent).toBe(false)
  expect(body.important).toBe(false)
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/tasks', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT moves a task to a quadrant by setting flags', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=t4', { method: 'PUT', body: JSON.stringify({ quadrant: 'do' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.urgent).toBe(true)
  expect(body.important).toBe(true)
})

it('PUT sets a single flag directly', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=t2', { method: 'PUT', body: JSON.stringify({ urgent: true }) }),
  )
  const body = await res.json()
  expect(body.urgent).toBe(true)
  expect(body.important).toBe(true) // unchanged
})

it('PUT with an invalid quadrant returns 400', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=t1', { method: 'PUT', body: JSON.stringify({ quadrant: 'nope' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid quadrant' })
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=zzz', { method: 'PUT', body: JSON.stringify({ quadrant: 'do' }) }),
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
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t2', 't3', 't4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/tasks?id=zzz', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
