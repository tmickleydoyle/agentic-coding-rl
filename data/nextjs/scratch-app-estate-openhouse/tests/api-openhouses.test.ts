import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, __reset } from '../app/api/openhouses/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists houses with visitor and feedback counts', async () => {
  const res = await GET(req('http://x/api/openhouses'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.houses.map((h: { id: string }) => h.id)).toEqual(['h1', 'h2', 'h3'])
  const h1 = body.houses.find((h: { id: string }) => h.id === 'h1')
  expect(h1.visitorCount).toBe(2)
  expect(h1.feedbackCount).toBe(1)
})

it('GET with a houseId returns just that house', async () => {
  const res = await GET(req('http://x/api/openhouses?houseId=h2'))
  const body = await res.json()
  expect(body.houses.length).toBe(1)
  expect(body.houses[0].id).toBe('h2')
})

it('GET with an unknown houseId returns an empty array', async () => {
  const res = await GET(req('http://x/api/openhouses?houseId=nope'))
  const body = await res.json()
  expect(body.houses).toEqual([])
})

it('POST registers a visitor and returns 201 with updated counts', async () => {
  const res = await POST(
    req('http://x/api/openhouses?houseId=h3', {
      method: 'POST',
      body: JSON.stringify({ name: 'Nora' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('h3')
  expect(body.visitorCount).toBe(1)
  expect(body.visitors.map((v: { name: string }) => v.name)).toContain('Nora')
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/openhouses?houseId=h1', { method: 'POST', body: JSON.stringify({}) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST on an unknown house returns 404', async () => {
  const res = await POST(
    req('http://x/api/openhouses?houseId=nope', {
      method: 'POST',
      body: JSON.stringify({ name: 'Nora' }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('PUT adds feedback and returns the updated house', async () => {
  const res = await PUT(
    req('http://x/api/openhouses?houseId=h2', {
      method: 'PUT',
      body: JSON.stringify({ visitor: 'Sam', rating: 4, note: 'Spacious' }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.feedbackCount).toBe(1)
  expect(body.feedback[0]).toEqual({ visitor: 'Sam', rating: 4, note: 'Spacious' })
})

it('PUT defaults rating to 0 and note to empty', async () => {
  const res = await PUT(
    req('http://x/api/openhouses?houseId=h2', {
      method: 'PUT',
      body: JSON.stringify({ visitor: 'Sam' }),
    }),
  )
  const body = await res.json()
  expect(body.feedback[0]).toEqual({ visitor: 'Sam', rating: 0, note: '' })
})

it('PUT without a visitor returns 400', async () => {
  const res = await PUT(
    req('http://x/api/openhouses?houseId=h1', { method: 'PUT', body: JSON.stringify({ rating: 3 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'visitor required' })
})

it('PUT on an unknown house returns 404', async () => {
  const res = await PUT(
    req('http://x/api/openhouses?houseId=nope', {
      method: 'PUT',
      body: JSON.stringify({ visitor: 'Sam' }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})
