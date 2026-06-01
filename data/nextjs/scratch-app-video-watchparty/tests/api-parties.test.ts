import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/parties/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded parties', async () => {
  const res = await GET(req('http://x/api/parties'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.parties.map((p: { id: string }) => p.id)).toEqual(['p1', 'p2', 'p3'])
})

it('GET by id returns a single party', async () => {
  const res = await GET(req('http://x/api/parties?id=p2'))
  const body = await res.json()
  expect(body.party.title).toBe('Design Systems Live')
  expect(body.party.queue).toEqual(['Intro'])
})

it('GET by unknown id returns 404', async () => {
  const res = await GET(req('http://x/api/parties?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('GET filtered by upcoming', async () => {
  const res = await GET(req('http://x/api/parties?filter=upcoming'))
  const body = await res.json()
  expect(body.parties.map((p: { id: string }) => p.id)).toEqual(['p1', 'p3'])
})

it('GET filtered by past', async () => {
  const res = await GET(req('http://x/api/parties?filter=past'))
  const body = await res.json()
  expect(body.parties.map((p: { id: string }) => p.id)).toEqual(['p2'])
})

it('POST creates a party with a new id and returns 201', async () => {
  const res = await POST(
    req('http://x/api/parties', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Party', time: 250 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('p4')
  expect(body).toMatchObject({ title: 'New Party', time: 250, rsvped: false, queue: [] })
})

it('POST without a title returns 400', async () => {
  const res = await POST(
    req('http://x/api/parties', { method: 'POST', body: JSON.stringify({ time: 250 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('POST without a numeric time returns 400', async () => {
  const res = await POST(
    req('http://x/api/parties', { method: 'POST', body: JSON.stringify({ title: 'X' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'time required' })
})

it('DELETE removes a party', async () => {
  const del = await DELETE(req('http://x/api/parties?id=p1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/parties'))
  expect((await res.json()).parties.map((p: { id: string }) => p.id)).toEqual(['p2', 'p3'])
})

it('DELETE on an unknown party returns 404', async () => {
  const res = await DELETE(req('http://x/api/parties?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
