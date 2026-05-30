import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/lists/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded vocab lists', async () => {
  const res = await GET(req('http://x/api/lists'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.lists.map((l: { id: string }) => l.id)).toEqual(['l1', 'l2'])
})

it('GET by id returns a single list with words', async () => {
  const res = await GET(req('http://x/api/lists?id=l1'))
  const body = await res.json()
  expect(body.list.name).toBe('Spanish')
  expect(body.list.words).toHaveLength(3)
})

it('GET unknown id returns 404', async () => {
  const res = await GET(req('http://x/api/lists?id=nope'))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST adds a word with mastery 0 and returns 201', async () => {
  const res = await POST(
    req('http://x/api/lists?id=l2', { method: 'POST', body: JSON.stringify({ term: 'no', answer: 'non' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('l2-w2')
  expect(body.term).toBe('no')
  expect(body.mastery).toBe(0)
})

it('POST with blank fields returns 400', async () => {
  const res = await POST(
    req('http://x/api/lists?id=l1', { method: 'POST', body: JSON.stringify({ term: 'x', answer: '  ' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'term and answer required' })
})

it('POST on unknown list returns 404', async () => {
  const res = await POST(
    req('http://x/api/lists?id=nope', { method: 'POST', body: JSON.stringify({ term: 'a', answer: 'b' }) }),
  )
  expect(res.status).toBe(404)
})

it('PUT grades a correct guess and raises mastery', async () => {
  const res = await PUT(
    req('http://x/api/lists?id=l1&wordId=l1-w2', { method: 'PUT', body: JSON.stringify({ guess: 'GATO' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  // l1-w2 starts at mastery 1 -> correct -> 2
  expect(body).toEqual({ correct: true, mastery: 2 })
})

it('PUT caps mastery at 3', async () => {
  const res = await PUT(
    req('http://x/api/lists?id=l1&wordId=l1-w3', { method: 'PUT', body: JSON.stringify({ guess: 'casa' }) }),
  )
  const body = await res.json()
  // l1-w3 starts at 3 -> stays 3
  expect(body).toEqual({ correct: true, mastery: 3 })
})

it('PUT resets mastery to 0 on a wrong guess', async () => {
  const res = await PUT(
    req('http://x/api/lists?id=l2&wordId=l2-w1', { method: 'PUT', body: JSON.stringify({ guess: 'non' }) }),
  )
  const body = await res.json()
  // l2-w1 starts at 2 -> wrong -> 0
  expect(body).toEqual({ correct: false, mastery: 0 })
})

it('PUT on an unknown word returns 404', async () => {
  const res = await PUT(
    req('http://x/api/lists?id=l1&wordId=nope', { method: 'PUT', body: JSON.stringify({ guess: 'x' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
