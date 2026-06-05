import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/candidates/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded candidates', async () => {
  const res = await GET(req('http://x/api/candidates'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.candidates.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2', 'c3', 'c4'])
})

it('GET filters by jobId', async () => {
  const res = await GET(req('http://x/api/candidates?jobId=j1'))
  const body = await res.json()
  expect(body.candidates.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2', 'c4'])
})

it('GET filters by stage', async () => {
  const res = await GET(req('http://x/api/candidates?stage=hired'))
  const body = await res.json()
  expect(body.candidates.map((c: { id: string }) => c.id)).toEqual(['c4'])
})

it('GET combines jobId and stage filters with AND', async () => {
  const res = await GET(req('http://x/api/candidates?jobId=j1&stage=applied'))
  const body = await res.json()
  expect(body.candidates.map((c: { id: string }) => c.id)).toEqual(['c2'])
})

it('POST creates a candidate with default stage applied and returns 201', async () => {
  const res = await POST(
    req('http://x/api/candidates', { method: 'POST', body: JSON.stringify({ name: 'Alan Turing', jobId: 'j2' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Alan Turing')
  expect(body.jobId).toBe('j2')
  expect(body.stage).toBe('applied')
  expect(body.id).toBe('c5')
})

it('POST accepts an explicit stage', async () => {
  const res = await POST(
    req('http://x/api/candidates', { method: 'POST', body: JSON.stringify({ name: 'Katherine', jobId: 'j1', stage: 'screen' }) }),
  )
  const body = await res.json()
  expect(body.stage).toBe('screen')
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/candidates', { method: 'POST', body: JSON.stringify({ jobId: 'j1' }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('PUT moves a candidate stage', async () => {
  const res = await PUT(
    req('http://x/api/candidates?id=c2', { method: 'PUT', body: JSON.stringify({ stage: 'interview' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.stage).toBe('interview')
})

it('PUT ignores an invalid stage value', async () => {
  const res = await PUT(
    req('http://x/api/candidates?id=c2', { method: 'PUT', body: JSON.stringify({ stage: 'bogus' }) }),
  )
  const body = await res.json()
  expect(body.stage).toBe('applied')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/candidates?id=nope', { method: 'PUT', body: JSON.stringify({ stage: 'hired' }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a candidate', async () => {
  const del = await DELETE(req('http://x/api/candidates?id=c1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/candidates'))
  const body = await res.json()
  expect(body.candidates.map((c: { id: string }) => c.id)).toEqual(['c2', 'c3', 'c4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/candidates?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
