import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/cards/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded cards', async () => {
  const res = await GET(req('http://x/api/cards'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.cards.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2', 'c3', 'c4'])
})

it('GET filters by column', async () => {
  const res = await GET(req('http://x/api/cards?column=doing'))
  const body = await res.json()
  expect(body.cards.map((c: { id: string }) => c.id)).toEqual(['c2', 'c3'])
})

it('GET filters by archived=false by default returns all', async () => {
  const res = await GET(req('http://x/api/cards?archived=false'))
  const body = await res.json()
  expect(body.cards.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2', 'c3', 'c4'])
})

it('POST creates a card in backlog and returns 201', async () => {
  const res = await POST(
    req('http://x/api/cards', { method: 'POST', body: JSON.stringify({ title: 'New card' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('New card')
  expect(body.column).toBe('backlog')
  expect(body.archived).toBe(false)
  expect(body.id).toBe('c5')
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/cards', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('POST with a whitespace title returns 400', async () => {
  const res = await POST(
    req('http://x/api/cards', { method: 'POST', body: JSON.stringify({ title: '   ' }) }),
  )
  expect(res.status).toBe(400)
})

it('PUT moves a card to a new column', async () => {
  const res = await PUT(
    req('http://x/api/cards?id=c1', { method: 'PUT', body: JSON.stringify({ column: 'done' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.column).toBe('done')
})

it('PUT can archive a card', async () => {
  const res = await PUT(
    req('http://x/api/cards?id=c2', { method: 'PUT', body: JSON.stringify({ archived: true }) }),
  )
  const body = await res.json()
  expect(body.archived).toBe(true)
})

it('PUT with an invalid column returns 400', async () => {
  const res = await PUT(
    req('http://x/api/cards?id=c1', { method: 'PUT', body: JSON.stringify({ column: 'nope' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid column' })
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/cards?id=zzz', { method: 'PUT', body: JSON.stringify({ column: 'done' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a card', async () => {
  const del = await DELETE(req('http://x/api/cards?id=c1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/cards'))
  const body = await res.json()
  expect(body.cards.map((c: { id: string }) => c.id)).toEqual(['c2', 'c3', 'c4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/cards?id=zzz', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
