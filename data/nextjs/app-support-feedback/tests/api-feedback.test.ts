import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/feedback/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded feedback', async () => {
  const res = await GET(req('http://x/api/feedback'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.feedback.map((f: { id: string }) => f.id)).toEqual(['f1', 'f2', 'f3', 'f4'])
})

it('GET filters by category', async () => {
  const res = await GET(req('http://x/api/feedback?category=UI'))
  const body = await res.json()
  expect(body.feedback.map((f: { id: string }) => f.id)).toEqual(['f1', 'f4'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/feedback?status=new'))
  const body = await res.json()
  expect(body.feedback.map((f: { id: string }) => f.id)).toEqual(['f1', 'f2'])
})

it('POST creates feedback and returns 201', async () => {
  const res = await POST(
    req('http://x/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ author: 'Pat', message: 'Nice work', category: 'Praise', sentiment: 'positive' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.author).toBe('Pat')
  expect(body.status).toBe('new')
  expect(body.id).toBe('f5')
})

it('POST defaults missing category and sentiment', async () => {
  const res = await POST(
    req('http://x/api/feedback', { method: 'POST', body: JSON.stringify({ author: 'Jo', message: 'hi' }) }),
  )
  const body = await res.json()
  expect(body.category).toBe('General')
  expect(body.sentiment).toBe('neutral')
})

it('POST without an author returns 400', async () => {
  const res = await POST(
    req('http://x/api/feedback', { method: 'POST', body: JSON.stringify({ message: 'hi' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'author required' })
})

it('POST without a message returns 400', async () => {
  const res = await POST(
    req('http://x/api/feedback', { method: 'POST', body: JSON.stringify({ author: 'Jo' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'message required' })
})

it('PUT updates the status', async () => {
  const res = await PUT(req('http://x/api/feedback?id=f1', { method: 'PUT', body: JSON.stringify({ status: 'reviewed' }) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('reviewed')
})

it('PUT with an invalid status returns 400', async () => {
  const res = await PUT(req('http://x/api/feedback?id=f1', { method: 'PUT', body: JSON.stringify({ status: 'archived' }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid status' })
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/feedback?id=nope', { method: 'PUT', body: JSON.stringify({ status: 'resolved' }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
