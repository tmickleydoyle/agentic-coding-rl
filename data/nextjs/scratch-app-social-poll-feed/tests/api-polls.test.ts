import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/polls/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded polls', async () => {
  const res = await GET(req('http://x/api/polls'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.polls.map((p: { id: string }) => p.id)).toEqual(['q1', 'q2', 'q3'])
})

it('GET sorts by trending (total votes descending)', async () => {
  const res = await GET(req('http://x/api/polls?sort=trending'))
  const body = await res.json()
  // q1=15, then q2/q3 = 8 each (stable)
  expect(body.polls[0].id).toBe('q1')
})

it('POST creates a poll and returns 201', async () => {
  const res = await POST(
    req('http://x/api/polls', { method: 'POST', body: JSON.stringify({ question: 'Pizza?', options: ['Yes', 'No'] }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('q4')
  expect(body.question).toBe('Pizza?')
  expect(body.options.map((o: { id: string }) => o.id)).toEqual(['q4-o1', 'q4-o2'])
  expect(body.options[0].votes).toBe(0)
  expect(body.votedOptionId).toBeNull()
})

it('POST ignores blank option strings', async () => {
  const res = await POST(
    req('http://x/api/polls', { method: 'POST', body: JSON.stringify({ question: 'Q', options: ['A', '  ', 'B'] }) }),
  )
  const body = await res.json()
  expect(body.options.map((o: { label: string }) => o.label)).toEqual(['A', 'B'])
})

it('POST without a question returns 400', async () => {
  const res = await POST(
    req('http://x/api/polls', { method: 'POST', body: JSON.stringify({ options: ['A', 'B'] }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'question required' })
})

it('POST with fewer than two options returns 400', async () => {
  const res = await POST(
    req('http://x/api/polls', { method: 'POST', body: JSON.stringify({ question: 'Q', options: ['Only'] }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'two options required' })
})

it('PUT records a vote and returns the poll', async () => {
  const res = await PUT(req('http://x/api/polls?id=q1&optionId=q1-o1', { method: 'PUT' }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.votedOptionId).toBe('q1-o1')
  expect(body.options.find((o: { id: string }) => o.id === 'q1-o1').votes).toBe(6)
})

it('PUT on an already-voted poll returns 409', async () => {
  const res = await PUT(req('http://x/api/polls?id=q2&optionId=q2-o1', { method: 'PUT' }))
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'already voted' })
})

it('PUT with a bad option id returns 400', async () => {
  const res = await PUT(req('http://x/api/polls?id=q1&optionId=nope', { method: 'PUT' }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'bad option' })
})

it('PUT on a missing poll returns 404', async () => {
  const res = await PUT(req('http://x/api/polls?id=nope&optionId=x', { method: 'PUT' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a poll', async () => {
  const del = await DELETE(req('http://x/api/polls?id=q1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/polls'))
  const body = await res.json()
  expect(body.polls.map((p: { id: string }) => p.id)).toEqual(['q2', 'q3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/polls?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
