import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/tasks/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded tasks', async () => {
  const res = await GET(req('http://x/api/tasks'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['k1', 'k2', 'k3'])
})

it('GET filters by projectId', async () => {
  const res = await GET(req('http://x/api/tasks?projectId=p1'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['k1', 'k2'])
})

it('GET filters by assigneeId', async () => {
  const res = await GET(req('http://x/api/tasks?assigneeId=m1'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['k1', 'k3'])
})

it('GET filters unassigned tasks', async () => {
  await POST(req('http://x/api/tasks', { method: 'POST', body: JSON.stringify({ title: 'Loose', projectId: 'p2' }) }))
  const res = await GET(req('http://x/api/tasks?assigneeId=unassigned'))
  const body = await res.json()
  expect(body.tasks.map((t: { title: string }) => t.title)).toEqual(['Loose'])
})

it('POST creates a task with status todo and returns 201', async () => {
  const res = await POST(
    req('http://x/api/tasks', { method: 'POST', body: JSON.stringify({ title: 'New one', projectId: 'p2', assigneeId: 'm2' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('New one')
  expect(body.projectId).toBe('p2')
  expect(body.assigneeId).toBe('m2')
  expect(body.status).toBe('todo')
  expect(body.id).toBe('k4')
})

it('POST without a title returns 400', async () => {
  const res = await POST(
    req('http://x/api/tasks', { method: 'POST', body: JSON.stringify({ projectId: 'p1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT reassigns a task', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=k1', { method: 'PUT', body: JSON.stringify({ assigneeId: 'm3' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.assigneeId).toBe('m3')
})

it('PUT can clear the assignee to null', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=k1', { method: 'PUT', body: JSON.stringify({ assigneeId: null }) }),
  )
  const body = await res.json()
  expect(body.assigneeId).toBeNull()
})

it('PUT updates status', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=k2', { method: 'PUT', body: JSON.stringify({ status: 'done' }) }),
  )
  const body = await res.json()
  expect(body.status).toBe('done')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/tasks?id=nope', { method: 'PUT', body: JSON.stringify({ status: 'done' }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a task', async () => {
  const del = await DELETE(req('http://x/api/tasks?id=k1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/tasks'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['k2', 'k3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/tasks?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
