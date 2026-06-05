import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/routines/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded routines', async () => {
  const res = await GET(req('http://x/api/routines'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.routines.map((r: { id: string }) => r.id)).toEqual(['r1', 'r2'])
})

it('POST creates a routine with id r3 and no steps', async () => {
  const res = await POST(
    req('http://x/api/routines', {
      method: 'POST',
      body: JSON.stringify({ name: 'Wind down', kind: 'evening' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('r3')
  expect(body.kind).toBe('evening')
  expect(body.steps).toEqual([])
  expect(body.history).toEqual([])
})

it('POST defaults an unknown kind to morning', async () => {
  const res = await POST(
    req('http://x/api/routines', { method: 'POST', body: JSON.stringify({ name: 'X', kind: 'noon' }) }),
  )
  const body = await res.json()
  expect(body.kind).toBe('morning')
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/routines', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('PUT toggling the last step completes the routine and adds today to history', async () => {
  const res = await PUT(
    req('http://x/api/routines', {
      method: 'PUT',
      body: JSON.stringify({ routineId: 'r1', stepId: 'r1-s3' }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  const step = body.steps.find((s: { id: string }) => s.id === 'r1-s3')
  expect(step.done).toBe(true)
  expect(body.history).toContain('2026-05-28')
})

it('PUT toggling a step off removes today from history', async () => {
  const res = await PUT(
    req('http://x/api/routines', {
      method: 'PUT',
      body: JSON.stringify({ routineId: 'r2', stepId: 'r2-s1' }),
    }),
  )
  const body = await res.json()
  expect(body.history).not.toContain('2026-05-28')
})

it('PUT on a missing routine returns 404', async () => {
  const res = await PUT(
    req('http://x/api/routines', {
      method: 'PUT',
      body: JSON.stringify({ routineId: 'nope', stepId: 'x' }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'routine not found' })
})

it('PUT on a missing step returns 404', async () => {
  const res = await PUT(
    req('http://x/api/routines', {
      method: 'PUT',
      body: JSON.stringify({ routineId: 'r1', stepId: 'nope' }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'step not found' })
})

it('DELETE removes a routine', async () => {
  const del = await DELETE(req('http://x/api/routines?id=r1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const list = await (await GET(req('http://x/api/routines'))).json()
  expect(list.routines.map((r: { id: string }) => r.id)).toEqual(['r2'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/routines?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
