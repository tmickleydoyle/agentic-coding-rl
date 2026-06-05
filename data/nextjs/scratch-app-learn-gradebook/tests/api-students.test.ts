import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/students/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded students', async () => {
  const res = await GET(req('http://x/api/students'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.students.map((s: { id: string }) => s.id)).toEqual(['s1', 's2', 's3'])
})

it('GET by id returns the student and average', async () => {
  const res = await GET(req('http://x/api/students?id=s1'))
  const body = await res.json()
  expect(body.student.name).toBe('Ada')
  expect(body.average).toBe(90)
})

it('GET average is null for a student without grades', async () => {
  await POST(req('http://x/api/students', { method: 'POST', body: JSON.stringify({ name: 'New' }) }))
  const res = await GET(req('http://x/api/students?id=s4'))
  const body = await res.json()
  expect(body.average).toBeNull()
})

it('GET unknown id returns 404', async () => {
  const res = await GET(req('http://x/api/students?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST creates a student and returns 201', async () => {
  const res = await POST(req('http://x/api/students', { method: 'POST', body: JSON.stringify({ name: 'Dennis' }) }))
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('s4')
  expect(body.name).toBe('Dennis')
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/students', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})
