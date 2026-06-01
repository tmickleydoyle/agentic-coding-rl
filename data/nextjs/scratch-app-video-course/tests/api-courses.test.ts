import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/courses/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded courses', async () => {
  const res = await GET(req('http://x/api/courses'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.courses.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2'])
})

it('GET by id returns a single course with modules', async () => {
  const res = await GET(req('http://x/api/courses?id=c1'))
  const body = await res.json()
  expect(body.course.title).toBe('React Mastery')
  expect(body.course.modules).toHaveLength(2)
})

it('GET by unknown id returns 404', async () => {
  const res = await GET(req('http://x/api/courses?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST marks a lesson complete and returns 201', async () => {
  const res = await POST(
    req('http://x/api/courses', {
      method: 'POST',
      body: JSON.stringify({ courseId: 'c1', lessonId: 'l1' }),
    }),
  )
  expect(res.status).toBe(201)
  expect((await res.json()).completedKeys).toEqual(['c1:l1'])
})

it('POST is idempotent (200, no duplicate) on repeat', async () => {
  await POST(
    req('http://x/api/courses', {
      method: 'POST',
      body: JSON.stringify({ courseId: 'c1', lessonId: 'l1' }),
    }),
  )
  const again = await POST(
    req('http://x/api/courses', {
      method: 'POST',
      body: JSON.stringify({ courseId: 'c1', lessonId: 'l1' }),
    }),
  )
  expect(again.status).toBe(200)
  expect((await again.json()).completedKeys).toEqual(['c1:l1'])
})

it('POST on an unknown lesson returns 404', async () => {
  const res = await POST(
    req('http://x/api/courses', {
      method: 'POST',
      body: JSON.stringify({ courseId: 'c1', lessonId: 'nope' }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST without both fields returns 400', async () => {
  const res = await POST(
    req('http://x/api/courses', { method: 'POST', body: JSON.stringify({ courseId: 'c1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'courseId and lessonId required' })
})

it('DELETE removes a completion', async () => {
  await POST(
    req('http://x/api/courses', {
      method: 'POST',
      body: JSON.stringify({ courseId: 'c1', lessonId: 'l1' }),
    }),
  )
  const del = await DELETE(req('http://x/api/courses?courseId=c1&lessonId=l1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
})

it('DELETE on a non-complete lesson returns 404', async () => {
  const res = await DELETE(req('http://x/api/courses?courseId=c1&lessonId=l1', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
