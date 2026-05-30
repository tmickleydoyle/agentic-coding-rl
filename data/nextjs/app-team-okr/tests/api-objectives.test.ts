import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/objectives/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists objectives with rolled-up progress and company rollup', async () => {
  const res = await GET(req('http://x/api/objectives'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.objectives.map((o: { id: string }) => o.id)).toEqual(['o1', 'o2'])
  const o1 = body.objectives.find((o: { id: string }) => o.id === 'o1')
  expect(o1.progress).toBe(60)
  expect(body.company).toBe(80)
})

it('POST creates an objective with no key results and returns 201', async () => {
  const res = await POST(
    req('http://x/api/objectives', { method: 'POST', body: JSON.stringify({ title: 'Scale infra', owner: 'Linus' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('o3')
  expect(body.title).toBe('Scale infra')
  expect(body.owner).toBe('Linus')
  expect(body.keyResults).toEqual([])
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/objectives', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('a created objective then appears in GET', async () => {
  await POST(req('http://x/api/objectives', { method: 'POST', body: JSON.stringify({ title: 'Reliability' }) }))
  const res = await GET(req('http://x/api/objectives'))
  const body = await res.json()
  expect(body.objectives.map((o: { title: string }) => o.title)).toContain('Reliability')
})

it('PUT sets a key result progress and returns the updated objective', async () => {
  const res = await PUT(
    req('http://x/api/objectives?id=o1&kr=kr1', { method: 'PUT', body: JSON.stringify({ progress: 100 }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  const kr1 = body.keyResults.find((k: { id: string }) => k.id === 'kr1')
  expect(kr1.progress).toBe(100)
  // (100 + 80) / 2 = 90
  expect(body.progress).toBe(90)
})

it('PUT clamps progress above 100', async () => {
  const res = await PUT(
    req('http://x/api/objectives?id=o2&kr=kr3', { method: 'PUT', body: JSON.stringify({ progress: 250 }) }),
  )
  const body = await res.json()
  const kr3 = body.keyResults.find((k: { id: string }) => k.id === 'kr3')
  expect(kr3.progress).toBe(100)
})

it('PUT clamps negative progress to 0', async () => {
  const res = await PUT(
    req('http://x/api/objectives?id=o1&kr=kr1', { method: 'PUT', body: JSON.stringify({ progress: -20 }) }),
  )
  const body = await res.json()
  const kr1 = body.keyResults.find((k: { id: string }) => k.id === 'kr1')
  expect(kr1.progress).toBe(0)
})

it('PUT on a missing objective returns 404', async () => {
  const res = await PUT(
    req('http://x/api/objectives?id=nope&kr=kr1', { method: 'PUT', body: JSON.stringify({ progress: 10 }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('PUT on a missing key result returns 404', async () => {
  const res = await PUT(
    req('http://x/api/objectives?id=o1&kr=nope', { method: 'PUT', body: JSON.stringify({ progress: 10 }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('company rollup reflects a PUT update', async () => {
  await PUT(req('http://x/api/objectives?id=o1&kr=kr1', { method: 'PUT', body: JSON.stringify({ progress: 100 }) }))
  const res = await GET(req('http://x/api/objectives'))
  const body = await res.json()
  // o1 -> 90, o2 -> 100, company -> 95
  expect(body.company).toBe(95)
})
