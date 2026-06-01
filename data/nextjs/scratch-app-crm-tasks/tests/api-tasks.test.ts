import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/tasks/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded follow-ups', async () => {
  const res = await GET(req('http://x/api/tasks'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t1', 't2', 't3', 't4'])
})

it('GET filters open tasks', async () => {
  const res = await GET(req('http://x/api/tasks?done=false'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t1', 't2', 't3'])
})

it('GET filters done tasks', async () => {
  const res = await GET(req('http://x/api/tasks?done=true'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t4'])
})

it('GET filters by contactId', async () => {
  const res = await GET(req('http://x/api/tasks?contactId=c1'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t1', 't3'])
})

it('GET byContact returns per-contact open and total counts', async () => {
  const res = await GET(req('http://x/api/tasks?byContact=true'))
  const body = await res.json()
  const c2 = body.contacts.find((c: { id: string }) => c.id === 'c2')
  expect(c2).toMatchObject({ id: 'c2', open: 1, total: 2 })
})

it('POST creates a follow-up with defaults and returns 201', async () => {
  const res = await POST(
    req('http://x/api/tasks', { method: 'POST', body: JSON.stringify({ title: 'Ping them' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('Ping them')
  expect(body.contactId).toBe('c1')
  expect(body.dueDate).toBe('2026-06-01')
  expect(body.done).toBe(false)
  expect(body.id).toBe('t5')
})

it('POST accepts contactId and dueDate', async () => {
  const res = await POST(
    req('http://x/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'X', contactId: 'c3', dueDate: '2026-07-01' }),
    }),
  )
  const body = await res.json()
  expect(body.contactId).toBe('c3')
  expect(body.dueDate).toBe('2026-07-01')
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/tasks', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT with an explicit done sets it', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=t1', { method: 'PUT', body: JSON.stringify({ done: true }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.done).toBe(true)
})

it('PUT with no body toggles done', async () => {
  const res = await PUT(req('http://x/api/tasks?id=t1', { method: 'PUT' }))
  const body = await res.json()
  expect(body.done).toBe(true)
  const res2 = await PUT(req('http://x/api/tasks?id=t1', { method: 'PUT' }))
  expect((await res2.json()).done).toBe(false)
})

it('PUT updates the due date', async () => {
  const res = await PUT(
    req('http://x/api/tasks?id=t1', { method: 'PUT', body: JSON.stringify({ dueDate: '2026-08-08' }) }),
  )
  const body = await res.json()
  expect(body.dueDate).toBe('2026-08-08')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/tasks?id=nope', { method: 'PUT', body: JSON.stringify({ done: true }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a follow-up', async () => {
  const del = await DELETE(req('http://x/api/tasks?id=t1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/tasks'))
  const body = await res.json()
  expect(body.tasks.map((t: { id: string }) => t.id)).toEqual(['t2', 't3', 't4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/tasks?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
