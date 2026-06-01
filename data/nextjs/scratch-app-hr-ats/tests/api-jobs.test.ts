import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/jobs/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded jobs with candidate counts', async () => {
  const res = await GET(req('http://x/api/jobs'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.jobs.map((j: { id: string }) => j.id)).toEqual(['j1', 'j2', 'j3'])
  const j1 = body.jobs.find((j: { id: string }) => j.id === 'j1')
  expect(j1.candidateCount).toBe(3)
})

it('GET reports zero count for empty jobs', async () => {
  const res = await GET(req('http://x/api/jobs'))
  const body = await res.json()
  const j3 = body.jobs.find((j: { id: string }) => j.id === 'j3')
  expect(j3.candidateCount).toBe(0)
})

it('POST creates a job and returns 201', async () => {
  const res = await POST(
    req('http://x/api/jobs', { method: 'POST', body: JSON.stringify({ title: 'Backend Engineer', department: 'Engineering' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('Backend Engineer')
  expect(body.department).toBe('Engineering')
  expect(body.id).toBe('j4')
})

it('POST defaults a missing department', async () => {
  const res = await POST(req('http://x/api/jobs', { method: 'POST', body: JSON.stringify({ title: 'Intern' }) }))
  const body = await res.json()
  expect(body.department).toBe('General')
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/jobs', { method: 'POST', body: JSON.stringify({ department: 'X' }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('a created job then appears in GET', async () => {
  await POST(req('http://x/api/jobs', { method: 'POST', body: JSON.stringify({ title: 'Data Scientist' }) }))
  const res = await GET(req('http://x/api/jobs'))
  const body = await res.json()
  expect(body.jobs.map((j: { title: string }) => j.title)).toContain('Data Scientist')
})
