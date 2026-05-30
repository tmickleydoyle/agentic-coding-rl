import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/decks/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded decks', async () => {
  const res = await GET(req('http://x/api/decks'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.decks.map((d: { id: string }) => d.id)).toEqual(['d1', 'd2'])
})

it('GET by id returns a single deck', async () => {
  const res = await GET(req('http://x/api/decks?id=d1'))
  const body = await res.json()
  expect(body.deck.name).toBe('Spanish')
  expect(body.deck.cards).toHaveLength(3)
})

it('GET ?due=1 returns only due cards', async () => {
  const res = await GET(req('http://x/api/decks?id=d1&due=1'))
  const body = await res.json()
  expect(body.cards.map((c: { id: string }) => c.id)).toEqual(['d1-c1', 'd1-c2'])
})

it('GET unknown deck returns 404', async () => {
  const res = await GET(req('http://x/api/decks?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST adds a card due today and returns 201', async () => {
  const res = await POST(
    req('http://x/api/decks?id=d2', { method: 'POST', body: JSON.stringify({ front: 'Spain', back: 'Madrid' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('d2-c2')
  expect(body.front).toBe('Spain')
  expect(body.dueDay).toBe(0)
  expect(body.interval).toBe(0)
})

it('POST with blank fields returns 400', async () => {
  const res = await POST(
    req('http://x/api/decks?id=d1', { method: 'POST', body: JSON.stringify({ front: '  ', back: 'x' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'front and back required' })
})

it('POST on unknown deck returns 404', async () => {
  const res = await POST(
    req('http://x/api/decks?id=nope', { method: 'POST', body: JSON.stringify({ front: 'a', back: 'b' }) }),
  )
  expect(res.status).toBe(404)
})

it('PUT grade easy doubles the interval and pushes the due day out', async () => {
  const res = await PUT(
    req('http://x/api/decks?id=d1&cardId=d1-c2', { method: 'PUT', body: JSON.stringify({ grade: 'easy' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  // d1-c2 had interval 2 -> easy doubles to 4, dueDay 0 + 4
  expect(body.interval).toBe(4)
  expect(body.dueDay).toBe(4)
})

it('PUT grade hard resets interval to 1 and due tomorrow', async () => {
  const res = await PUT(
    req('http://x/api/decks?id=d1&cardId=d1-c2', { method: 'PUT', body: JSON.stringify({ grade: 'hard' }) }),
  )
  const body = await res.json()
  expect(body.interval).toBe(1)
  expect(body.dueDay).toBe(1)
})

it('PUT with an invalid grade returns 400', async () => {
  const res = await PUT(
    req('http://x/api/decks?id=d1&cardId=d1-c1', { method: 'PUT', body: JSON.stringify({ grade: 'meh' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid grade' })
})

it('PUT on an unknown card returns 404', async () => {
  const res = await PUT(
    req('http://x/api/decks?id=d1&cardId=nope', { method: 'PUT', body: JSON.stringify({ grade: 'easy' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
