import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/decks/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded cards', async () => {
  const res = await GET(req('http://x/api/decks'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.cards.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2', 'c3', 'c4'])
})

it('GET filters by deckId', async () => {
  const res = await GET(req('http://x/api/decks?deckId=d2'))
  const body = await res.json()
  expect(body.cards.map((c: { id: string }) => c.id)).toEqual(['c3', 'c4'])
})

it('GET filters by known=true', async () => {
  const res = await GET(req('http://x/api/decks?known=true'))
  const body = await res.json()
  expect(body.cards.map((c: { id: string }) => c.id)).toEqual(['c2'])
})

it('GET filters by known=false', async () => {
  const res = await GET(req('http://x/api/decks?known=false'))
  const body = await res.json()
  expect(body.cards.map((c: { id: string }) => c.id)).toEqual(['c1', 'c3', 'c4'])
})

it('POST creates a card and returns 201', async () => {
  const res = await POST(
    req('http://x/api/decks', {
      method: 'POST',
      body: JSON.stringify({ deckId: 'd1', front: 'perro', back: 'dog' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.front).toBe('perro')
  expect(body.back).toBe('dog')
  expect(body.known).toBe(false)
  expect(body.id).toBe('c5')
})

it('POST without front or back returns 400', async () => {
  const res = await POST(
    req('http://x/api/decks', { method: 'POST', body: JSON.stringify({ deckId: 'd1', front: 'x' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'front and back required' })
})

it('PUT toggles known when no explicit value is given', async () => {
  const res = await PUT(req('http://x/api/decks?id=c1', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.known).toBe(true)
})

it('PUT sets known explicitly', async () => {
  const res = await PUT(
    req('http://x/api/decks?id=c2', { method: 'PUT', body: JSON.stringify({ known: false }) }),
  )
  const body = await res.json()
  expect(body.known).toBe(false)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/decks?id=nope', { method: 'PUT', body: JSON.stringify({ known: true }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a card', async () => {
  const del = await DELETE(req('http://x/api/decks?id=c1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/decks'))
  const body = await res.json()
  expect(body.cards.map((c: { id: string }) => c.id)).toEqual(['c2', 'c3', 'c4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/decks?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
