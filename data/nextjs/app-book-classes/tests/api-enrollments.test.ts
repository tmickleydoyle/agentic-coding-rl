import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/enrollments/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded enrollments', async () => {
  const res = await GET(req('http://x/api/enrollments'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.enrollments.map((e: { id: string }) => e.id)).toEqual(['e1', 'e2', 'e3'])
})

it('GET filters by classId', async () => {
  const res = await GET(req('http://x/api/enrollments?classId=c2'))
  const body = await res.json()
  expect(body.enrollments.map((e: { id: string }) => e.id)).toEqual(['e2', 'e3'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/enrollments?status=waitlisted'))
  const body = await res.json()
  expect(body.enrollments.map((e: { id: string }) => e.id)).toEqual(['e3'])
})

it('POST enrolls a student when there is room', async () => {
  const res = await POST(
    req('http://x/api/enrollments', {
      method: 'POST',
      body: JSON.stringify({ classId: 'c1', student: 'Linus' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('e4')
  expect(body.status).toBe('enrolled')
})

it('POST waitlists when the class is full', async () => {
  const res = await POST(
    req('http://x/api/enrollments', {
      method: 'POST',
      body: JSON.stringify({ classId: 'c2', student: 'Margaret' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.status).toBe('waitlisted')
})

it('POST with a missing student returns 400', async () => {
  const res = await POST(
    req('http://x/api/enrollments', { method: 'POST', body: JSON.stringify({ classId: 'c1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid enrollment' })
})

it('POST to an unknown class returns 404', async () => {
  const res = await POST(
    req('http://x/api/enrollments', {
      method: 'POST',
      body: JSON.stringify({ classId: 'zzz', student: 'Nobody' }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'class not found' })
})

it('DELETE of an enrolled student promotes the oldest waitlisted', async () => {
  const del = await DELETE(req('http://x/api/enrollments?id=e2', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true, promotedId: 'e3' })
  const res = await GET(req('http://x/api/enrollments?classId=c2&status=enrolled'))
  const body = await res.json()
  expect(body.enrollments.map((e: { id: string }) => e.id)).toEqual(['e3'])
})

it('DELETE of a waitlisted student promotes nobody', async () => {
  const del = await DELETE(req('http://x/api/enrollments?id=e3', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true, promotedId: null })
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/enrollments?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
