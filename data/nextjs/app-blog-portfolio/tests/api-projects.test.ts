import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/projects/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists projects and posts', async () => {
  const res = await GET(req('http://x/api/projects'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.projects.map((p: { id: string }) => p.id)).toEqual(['j1', 'j2', 'j3'])
  expect(body.posts.map((p: { id: string }) => p.id)).toEqual(['w1', 'w2', 'w3'])
})

it('GET filters projects by featured', async () => {
  const res = await GET(req('http://x/api/projects?featured=true'))
  const body = await res.json()
  expect(body.projects.map((p: { id: string }) => p.id)).toEqual(['j1'])
})

it('GET filters projects by tag', async () => {
  const res = await GET(req('http://x/api/projects?tag=web'))
  const body = await res.json()
  expect(body.projects.map((p: { id: string }) => p.id)).toEqual(['j1', 'j3'])
})

it('GET combines featured and tag filters with AND', async () => {
  const res = await GET(req('http://x/api/projects?featured=true&tag=web'))
  const body = await res.json()
  expect(body.projects.map((p: { id: string }) => p.id)).toEqual(['j1'])
})

it('POST creates a project and returns 201', async () => {
  const res = await POST(
    req('http://x/api/projects', {
      method: 'POST',
      body: JSON.stringify({ title: 'CLI tool', tags: ['rust'] }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('j4')
  expect(body.title).toBe('CLI tool')
  expect(body.tags).toEqual(['rust'])
  expect(body.featured).toBe(false)
})

it('POST defaults tags to an empty array', async () => {
  const res = await POST(
    req('http://x/api/projects', { method: 'POST', body: JSON.stringify({ title: 'No tags' }) }),
  )
  const body = await res.json()
  expect(body.tags).toEqual([])
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/projects', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('PUT toggles featured when no explicit value is given', async () => {
  const res = await PUT(req('http://x/api/projects?id=j2', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.featured).toBe(true)
})

it('PUT sets featured explicitly', async () => {
  const res = await PUT(
    req('http://x/api/projects?id=j1', { method: 'PUT', body: JSON.stringify({ featured: false }) }),
  )
  const body = await res.json()
  expect(body.featured).toBe(false)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/projects?id=nope', { method: 'PUT', body: JSON.stringify({ featured: true }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('a created project then appears in GET', async () => {
  await POST(
    req('http://x/api/projects', { method: 'POST', body: JSON.stringify({ title: 'Synth' }) }),
  )
  const res = await GET(req('http://x/api/projects'))
  const body = await res.json()
  expect(body.projects.map((p: { title: string }) => p.title)).toContain('Synth')
})
