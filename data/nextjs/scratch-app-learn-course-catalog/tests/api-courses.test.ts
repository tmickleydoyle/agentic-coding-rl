import { it, expect, beforeEach } from 'vitest'
import { GET, __reset } from '../app/api/courses/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded courses', async () => {
  const res = await GET(req('http://x/api/courses'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.courses.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2', 'c3'])
})

it('GET by id returns a single course with lessons', async () => {
  const res = await GET(req('http://x/api/courses?id=c1'))
  const body = await res.json()
  expect(body.course.title).toBe('Intro to React')
  expect(body.course.lessons).toHaveLength(4)
})

it('GET by unknown id returns 404', async () => {
  const res = await GET(req('http://x/api/courses?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
