import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/quizzes/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded quizzes', async () => {
  const res = await GET(req('http://x/api/quizzes'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.quizzes.map((q: { id: string }) => q.id)).toEqual(['q1', 'q2'])
})

it('GET by id returns a single quiz', async () => {
  const res = await GET(req('http://x/api/quizzes?id=q1'))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.quiz.title).toBe('Geography Basics')
  expect(body.quiz.questions).toHaveLength(3)
})

it('GET by unknown id returns 404', async () => {
  const res = await GET(req('http://x/api/quizzes?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST grades a perfect attempt as passed', async () => {
  const res = await POST(
    req('http://x/api/quizzes?id=q1', {
      method: 'POST',
      body: JSON.stringify({ answers: { q1a: 'c1', q1b: 'c2', q1c: 'c3' } }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body).toEqual({ correct: 3, total: 3, passed: true })
})

it('POST grades a partial attempt and applies passScore', async () => {
  const res = await POST(
    req('http://x/api/quizzes?id=q1', {
      method: 'POST',
      body: JSON.stringify({ answers: { q1a: 'c1', q1b: 'c1', q1c: 'c1' } }),
    }),
  )
  const body = await res.json()
  // only q1a correct -> 1 correct, passScore 2 -> failed
  expect(body).toEqual({ correct: 1, total: 3, passed: false })
})

it('POST grades an empty attempt as zero', async () => {
  const res = await POST(
    req('http://x/api/quizzes?id=q2', { method: 'POST', body: JSON.stringify({ answers: {} }) }),
  )
  const body = await res.json()
  expect(body).toEqual({ correct: 0, total: 1, passed: false })
})

it('POST on unknown id returns 404', async () => {
  const res = await POST(
    req('http://x/api/quizzes?id=nope', { method: 'POST', body: JSON.stringify({ answers: {} }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST with missing id returns 400', async () => {
  const res = await POST(req('http://x/api/quizzes', { method: 'POST', body: JSON.stringify({ answers: {} }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'id required' })
})
