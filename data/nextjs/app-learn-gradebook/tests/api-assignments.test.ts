import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/assignments/route'
import { GET as STUDENT_GET } from '../app/api/students/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded assignments', async () => {
  const res = await GET(req('http://x/api/assignments'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.assignments.map((a: { id: string }) => a.id)).toEqual(['a1', 'a2'])
})

it('POST creates an assignment and returns 201', async () => {
  const res = await POST(req('http://x/api/assignments', { method: 'POST', body: JSON.stringify({ title: 'Final' }) }))
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('a3')
  expect(body.title).toBe('Final')
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/assignments', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT records a grade and clamps to 0-100', async () => {
  const res = await PUT(
    req('http://x/api/assignments?studentId=s2&assignmentId=a2', { method: 'PUT', body: JSON.stringify({ score: 150 }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body).toEqual({ key: 's2:a2', score: 100 })
})

it('PUT affects the computed student average', async () => {
  await PUT(
    req('http://x/api/assignments?studentId=s2&assignmentId=a2', { method: 'PUT', body: JSON.stringify({ score: 88 }) }),
  )
  const res = await STUDENT_GET(req('http://x/api/students?id=s2'))
  const body = await res.json()
  // s2 now (72+88)/2 = 80
  expect(body.average).toBe(80)
})

it('PUT on an unknown student returns 404', async () => {
  const res = await PUT(
    req('http://x/api/assignments?studentId=nope&assignmentId=a1', { method: 'PUT', body: JSON.stringify({ score: 50 }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('PUT on an unknown assignment returns 404', async () => {
  const res = await PUT(
    req('http://x/api/assignments?studentId=s1&assignmentId=nope', { method: 'PUT', body: JSON.stringify({ score: 50 }) }),
  )
  expect(res.status).toBe(404)
})

it('PUT with a non-numeric score returns 400', async () => {
  const res = await PUT(
    req('http://x/api/assignments?studentId=s1&assignmentId=a1', { method: 'PUT', body: JSON.stringify({ score: 'abc' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'score required' })
})
