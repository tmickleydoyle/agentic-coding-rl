import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/enrollments/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET starts with no enrollments', async () => {
  const res = await GET(req('http://x/api/enrollments'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.enrollments).toEqual([])
})

it('POST creates an enrollment and returns 201', async () => {
  const res = await POST(
    req('http://x/api/enrollments', { method: 'POST', body: JSON.stringify({ courseId: 'c1' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body).toEqual({ courseId: 'c1', completedLessonIds: [] })
})

it('POST on an unknown course returns 404', async () => {
  const res = await POST(
    req('http://x/api/enrollments', { method: 'POST', body: JSON.stringify({ courseId: 'nope' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST twice on the same course returns 409', async () => {
  await POST(req('http://x/api/enrollments', { method: 'POST', body: JSON.stringify({ courseId: 'c1' }) }))
  const res = await POST(
    req('http://x/api/enrollments', { method: 'POST', body: JSON.stringify({ courseId: 'c1' }) }),
  )
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'already enrolled' })
})

it('POST without a courseId returns 400', async () => {
  const res = await POST(req('http://x/api/enrollments', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'courseId required' })
})

it('PUT toggles a lesson on and off', async () => {
  await POST(req('http://x/api/enrollments', { method: 'POST', body: JSON.stringify({ courseId: 'c1' }) }))
  const on = await PUT(
    req('http://x/api/enrollments?courseId=c1', { method: 'PUT', body: JSON.stringify({ lessonId: 'l1' }) }),
  )
  expect((await on.json()).completedLessonIds).toEqual(['l1'])
  const off = await PUT(
    req('http://x/api/enrollments?courseId=c1', { method: 'PUT', body: JSON.stringify({ lessonId: 'l1' }) }),
  )
  expect((await off.json()).completedLessonIds).toEqual([])
})

it('PUT on a non-enrolled course returns 404', async () => {
  const res = await PUT(
    req('http://x/api/enrollments?courseId=c1', { method: 'PUT', body: JSON.stringify({ lessonId: 'l1' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes an enrollment', async () => {
  await POST(req('http://x/api/enrollments', { method: 'POST', body: JSON.stringify({ courseId: 'c1' }) }))
  const del = await DELETE(req('http://x/api/enrollments?courseId=c1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/enrollments'))
  expect((await res.json()).enrollments).toEqual([])
})

it('DELETE on a non-enrolled course returns 404', async () => {
  const res = await DELETE(req('http://x/api/enrollments?courseId=c1', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
